'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { toNumber } from '@/helpers/conversions'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'
import {
    parseLines,
    calculateTotals,
    generateDocumentNumber,
} from '@/helpers/formDataParser'

// Fonction commune pour extraire les données du formulaire
function parseInvoiceFormData(formData: FormData) {
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
    const interest_rate =
        toNumber(
            formData.get('interest_rate') ??
                payload?.interest_rate?.toString() ??
                null
        ) ?? null

    const linesArr = parseLines(formData, payload)
    const { subtotal_cents, tax_cents, total_cents } = calculateTotals(linesArr)

    return {
        client_id,
        name: formData.get('name') as string,
        description,
        currency,
        terms,
        subtotal_cents,
        tax_cents,
        total_cents,
        payment_date: formData.get('payment_date') as string,
        payment_method: formData.get('payment_method') as string,
        interest_rate,
        linesArr,
    }
}

export async function createInvoice(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const data = parseInvoiceFormData(formData)

    if (!data.client_id) {
        console.error('createInvoice validation error: client_id is required')
        redirect('/error')
    }

    if (data.linesArr.length === 0) {
        redirect('/error')
    }

    // insert invoice
    const { data: insertedInvoice, error: qErr } = await supabase
        .from('invoices')
        .insert({
            owner_id: user.id,
            status: 'draft',
            ...data,
            linesArr: undefined, // exclure linesArr
        })
        .select('id')
        .single()

    if (qErr) {
        console.error('invoice insert error', qErr)
        redirect('/error')
    }

    const invoiceId = (insertedInvoice as InvoiceFormPayload).id

    // Insert invoice items
    const itemsToInsert = data.linesArr.map((l) => ({
        invoice_id: invoiceId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

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

    // Vérifier que la facture existe et appartient à l'utilisateur
    const { data: existingInvoice, error: fetchError } = await supabase
        .from('invoices')
        .select('id, status')
        .eq('id', invoiceId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !existingInvoice) {
        console.error('Invoice not found or unauthorized', fetchError)
        redirect('/error')
    }

    const data = parseInvoiceFormData(formData)

    if (!data.client_id) {
        console.error('updateInvoice validation error: client_id is required')
        redirect('/error')
    }

    if (data.linesArr.length === 0) {
        redirect('/error')
    }

    // Mettre à jour la facture
    const { error: updateError } = await supabase
        .from('invoices')
        .update({
            ...data,
            linesArr: undefined, // exclure linesArr
        })
        .eq('id', invoiceId)
        .eq('owner_id', user.id)

    if (updateError) {
        console.error('invoice update error', updateError)
        redirect('/error')
    }

    // Supprimer les anciennes lignes et insérer les nouvelles
    const { error: deleteError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoiceId)

    if (deleteError) {
        console.error('invoice items delete error', deleteError)
        redirect('/error')
    }

    const itemsToInsert = data.linesArr.map((l) => ({
        invoice_id: invoiceId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

    const { error: itemsErr } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert)

    if (itemsErr) {
        console.error('invoice items insert error', itemsErr)
        redirect('/error')
    }

    revalidatePath('/dashboard')
    revalidatePath('/invoices')
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
        .select('status, formatted_no')
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

    // Générer le numéro de facture unique
    let invoiceNumber: string
    try {
        invoiceNumber = await generateDocumentNumber({
            supabase,
            userId: user.id,
            documentType: 'invoice',
        })
    } catch (error) {
        console.error('Failed to generate invoice number', error)
        redirect('/error')
    }

    // Mettre à jour le statut et le numéro de facture
    const { error: updateError } = await supabase
        .from('invoices')
        .update({
            status: 'published',
            formatted_no: invoiceNumber,
        })
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
