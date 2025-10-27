'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { toNumber } from '@/helpers/conversions'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'
import { parseLines, calculateTotals } from '@/helpers/formDataParser'

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

    if (!client_id) {
        console.error('createInvoice validation error: client_id is required')
        redirect('/error')
    }

    // Parse les lignes du formulaire
    const linesArr = parseLines(formData, payload)

    if (linesArr.length === 0) {
        // pas de lignes => erreur de validation
        redirect('/error')
    }

    // Calcule les totaux
    const { subtotal_cents, tax_cents, total_cents } = calculateTotals(linesArr)

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

export async function updateInvoice(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const invoiceId = Number(formData.get('invoice_id'))

    if (!invoiceId) {
        console.error('Invoice ID is required')
        redirect('/error')
    }

    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !invoice) {
        console.error('Invoice not found or unauthorized', fetchError)
        redirect('/error')
    }

    const { data: items, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('id', { ascending: true })

    if (itemsError || !items) {
        console.error('Invoice items not found or unauthorized', itemsError)
        redirect('/error')
    }

    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .eq('owner_id', user.id)
        .single()

    if (clientError || !client) {
        console.error('createInvoice validation error: client_id is required')
        redirect('/error')
    }

    revalidatePath(`/invoices/${invoiceId}`)
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
