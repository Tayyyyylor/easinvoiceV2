/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotePdf } from '@/pdf/QuotePdf'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await ctx.params
  const quoteId = Number(id)

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user)
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: quote, error } = await supabase
        .from('quotes')
        .select(
            `
     *
    `
        )
        .eq('id', quoteId)
        .single()

    if (error || !quote)
        return NextResponse.json({ error: 'not found' }, { status: 404 })

    const element = React.createElement(QuotePdf as any, {
        quote,
        items: quote.quote_items || [],
        theme: quote.pdf_overrides ?? {},
    }) as any
    const buffer = await renderToBuffer(element as any)

    return new Response(buffer as unknown as BodyInit, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="quote-${quoteId}.pdf"`,
        },
    })
}
