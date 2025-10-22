/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eurosToCents, toNumber } from '@/helpers/conversions'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export async function createInvoice(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    // Support payload JSON pour valeurs issues de RHF
    let payload: InvoiceFormPayload | null = null
    if (formData.get('payload')) {
        try {
            payload = JSON.parse(formData.get('payload') as string)
        } catch (e) {
            console.error('invalid payload json', e)
        }
    }

    const description =
        ((formData.get('description') || payload?.description) as string) ??
        null
    const currency =
        ((formData.get('currency') || payload?.currency) as string) ?? 'EUR'
    const terms = ((formData.get('terms') || payload?.terms) as string) ?? null
    const client_id =
        toNumber(
            formData.get('client_id') ?? payload?.client_id?.toString() ?? null
        ) ?? null

    // Validation serveur: client obligatoire
    if (!client_id) {
        console.error('createInvoice validation error: client_id is required')
        redirect('/error')
    }

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const linesMap = new Map<number, Record<string, any>>()
    for (const [key, value] of formData.entries()) {
        const m = key.match(/^lines(?:\[(\d+)\]|\.(\d+))\.(.+)$/) // support lines[0].x or lines.0.x
        if (m) {
            const idx = Number(m[1] ?? m[2])
            const field = m[3]
            if (!linesMap.has(idx)) linesMap.set(idx, {})
            linesMap.get(idx)![field] = value
        }
    }

    // Si payload fourni, on récupère les lignes depuis payload
    if (linesMap.size === 0 && payload?.lines && Array.isArray(payload.lines)) {
        payload.lines.forEach((l: InvoiceFormPayload, i: number) =>
            linesMap.set(i, l)
        )
    }

    const linesArr: Array<{
        description: string
        type?: string
        quantity: number
        total_price: number
        unit_price: number
        tax_rate: number
    }> = []

    for (const [, obj] of Array.from(linesMap.entries()).sort(
        (a, b) => a[0] - b[0]
    )) {
        const desc = (obj.description ?? obj.label ?? '') + ''
        const type = (obj.type ?? 'service') + ''
        const quantity = toNumber(obj.quantity ?? obj.qty ?? '1') ?? 1
        const unit_price =
            toNumber(obj.unit_price ?? obj.unit_price_eur ?? '0') ?? 0
        const tax_rate_pct = toNumber(obj.tax_rate ?? obj.tax ?? '0') ?? 0

        const unit_price_cents = eurosToCents(unit_price)
        const line_total_cents = Math.round(quantity * unit_price_cents)

        linesArr.push({
            description: desc,
            type,
            quantity,
            unit_price,
            total_price: line_total_cents,
            tax_rate: tax_rate_pct,
        })
    }

    if (linesArr.length === 0) {
        // pas de lignes => erreur de validation
        redirect('/error') // ou throw new Error(...)
    }

    // calcule totaux
    const subtotal_cents = linesArr.reduce(
        (s, l) => s + (l.total_price ?? 0),
        0
    )
    // calcul des taxes : pour chaque ligne, taxe = line_total * tax_rate_pct/100
    const tax_cents = linesArr.reduce(
        (s, l) =>
            s + Math.round(((l.total_price ?? 0) * (l.tax_rate ?? 0)) / 100),
        0
    )
    const total_cents = subtotal_cents + tax_cents

    const interest_rate =
        toNumber(
            formData.get('interest_rate') ??
                payload?.interest_rate?.toString() ??
                null
        ) ?? null

    // insert invoice
    const { data: insertedInvoice, error: qErr } = await supabase
        .from('invoices')
        .insert({
            owner_id: user.id,
            client_id,
            name: formData.get('name') as string,
            status: 'draft',
            description,
            currency,
            terms,
            subtotal_cents,
            tax_cents,
            total_cents,
            payment_date: formData.get('payment_date') as string,
            payment_method: formData.get('payment_method') as string,
            interest_rate,
        })
        .select('id')
        .single()

    if (qErr) {
        console.error('invoice insert error', qErr)
        redirect('/error')
    }

    const invoiceId = (insertedInvoice as InvoiceFormPayload).id

    // prepare items for insertion
    const itemsToInsert = linesArr.map((l) => ({
        invoice_id: invoiceId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

    // insert invoice items
    const { error: itemsErr } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert)
    if (itemsErr) {
        console.error('invoice items insert error', itemsErr)
        redirect('/error')
    }

    revalidatePath('/dashboard')
    redirect(`/invoices/${invoiceId}`)
}

export async function finalizeInvoice(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const invoiceId = Number(formData.get('invoice_id'))

    if (!invoiceId) {
        console.error('Invoice ID is required')
        redirect('/error')
    }

    // Vérifier que la facture appartient à l'utilisateur
    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !invoice) {
        console.error('Invoice not found or unauthorized', fetchError)
        redirect('/error')
    }

    // Vérifier que le statut est 'draft'
    if (invoice.status !== 'draft') {
        console.error('Invoice is already finalized')
        redirect('/error')
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'published' })
        .eq('id', invoiceId)
        .eq('owner_id', user.id)

    if (updateError) {
        console.error('Failed to finalize invoice', updateError)
        redirect('/error')
    }

    revalidatePath(`/invoices/${invoiceId}`)
    revalidatePath('/invoices')
    revalidatePath('/dashboard')
    redirect(`/invoices`)
}
