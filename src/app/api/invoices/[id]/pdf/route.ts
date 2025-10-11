/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePdf } from '@/components/pdf/InvoicePdf'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    const { id } = await ctx.params
    const invoiceId = Number(id)

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user)
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: invoice, error } = await supabase
        .from('invoices')
        .select(
            `
            *,
            invoice_items (*)
        `
        )
        .eq('id', invoiceId)
        .eq('owner_id', user.id)
        .single()

    if (error || !invoice)
        return NextResponse.json({ error: 'not found' }, { status: 404 })

    // Récupérer le profil de l'utilisateur
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Récupérer le client
    const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .eq('owner_id', user.id)
        .single()

    // Récupération explicite des items si nécessaire
    let items = invoice.invoice_items || []
    if (!items || items.length === 0) {
        const { data: fetchedItems } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId)
            .order('id', { ascending: true })
        items = fetchedItems || []
    }

    const element = React.createElement(InvoicePdf as any, {
        invoice,
        items,
        emitter: profile,
        client,
        theme: invoice.pdf_overrides ?? {},
    }) as any
    const buffer = await renderToBuffer(element as any)

    return new Response(buffer as unknown as BodyInit, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="invoice-${invoiceId}.pdf"`,
        },
    })
}
