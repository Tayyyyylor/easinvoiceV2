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
function parseQuoteFormData(formData: FormData) {
    let payload: QuoteFormPayload | null = null
    if (formData.get('payload')) {
        try {
            payload = JSON.parse(formData.get('payload') as string)
        } catch (e) {
            console.error('invalid payload json', e)
        }
    }

    const validityDays =
        toNumber(
            formData.get('validity_days') ??
                payload?.validity_days?.toString() ??
                null
        ) ?? 30
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

    const linesArr = parseLines(formData, payload)
    const { subtotal_cents, tax_cents, total_cents } = calculateTotals(linesArr)

    return {
        client_id,
        name: formData.get('name') as string,
        validity_days: validityDays,
        description,
        currency,
        terms,
        subtotal_cents,
        tax_cents,
        total_cents,
        linesArr,
    }
}

export async function createQuote(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const data = parseQuoteFormData(formData)

    if (!data.client_id) {
        console.error('createQuote validation error: client_id is required')
        redirect('/error')
    }

    if (data.linesArr.length === 0) {
        redirect('/error')
    }

    // insert quote
    const { data: insertedQuote, error: qErr } = await supabase
        .from('quotes')
        .insert({
            owner_id: user.id,
            status: 'draft',
            ...data,
            linesArr: undefined, // exclure linesArr
        })
        .select('id')
        .single()

    if (qErr) {
        console.error('quote insert error', qErr)
        redirect('/error')
    }

    const quoteId = (insertedQuote as QuoteFormPayload).id

    // Insert quote items
    const itemsToInsert = data.linesArr.map((l) => ({
        quote_id: quoteId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

    const { error: itemsErr } = await supabase
        .from('quote_items')
        .insert(itemsToInsert)
    if (itemsErr) {
        console.error('quote items insert error', itemsErr)
        redirect('/error')
    }

    revalidatePath('/dashboard')
    redirect(`/quotes/${quoteId}`)
}

export async function updateQuote(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const quoteId = Number(formData.get('quote_id'))

    if (!quoteId) {
        console.error('Quote ID is required')
        redirect('/error')
    }

    // Vérifier que le devis existe et appartient à l'utilisateur
    const { data: existingQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('id, status')
        .eq('id', quoteId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !existingQuote) {
        console.error('Quote not found or unauthorized', fetchError)
        redirect('/error')
    }

    const data = parseQuoteFormData(formData)

    if (!data.client_id) {
        console.error('updateQuote validation error: client_id is required')
        redirect('/error')
    }

    if (data.linesArr.length === 0) {
        redirect('/error')
    }

    // Mettre à jour le devis
    const { error: updateError } = await supabase
        .from('quotes')
        .update({
            ...data,
            linesArr: undefined, // exclure linesArr
        })
        .eq('id', quoteId)
        .eq('owner_id', user.id)

    if (updateError) {
        console.error('quote update error', updateError)
        redirect('/error')
    }

    // Supprimer les anciennes lignes et insérer les nouvelles
    const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', quoteId)

    if (deleteError) {
        console.error('quote items delete error', deleteError)
        redirect('/error')
    }

    const itemsToInsert = data.linesArr.map((l) => ({
        quote_id: quoteId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

    const { error: itemsErr } = await supabase
        .from('quote_items')
        .insert(itemsToInsert)

    if (itemsErr) {
        console.error('quote items insert error', itemsErr)
        redirect('/error')
    }

    revalidatePath('/dashboard')
    revalidatePath('/quotes')
    revalidatePath(`/quotes/${quoteId}`)
    redirect(`/quotes/${quoteId}`)
}

export async function finalizeQuote(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const quoteId = Number(formData.get('quote_id'))

    if (!quoteId) {
        console.error('Quote ID is required')
        redirect('/error')
    }

    // Vérifier que le devis appartient à l'utilisateur
    const { data: quote, error: fetchError } = await supabase
        .from('quotes')
        .select('status')
        .eq('id', quoteId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !quote) {
        console.error('Quote not found or unauthorized', fetchError)
        redirect('/error')
    }

    // Vérifier que le statut est 'draft'
    if (quote.status !== 'draft') {
        console.error('Quote is already finalized')
        redirect('/error')
    }

    // Générer le numéro de facture unique
    let quoteNumber: string
    try {
        quoteNumber = await generateDocumentNumber({
            supabase,
            userId: user.id,
            documentType: 'quote',
        })
    } catch (error) {
        console.error('Failed to generate invoice number', error)
        redirect('/error')
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
        .from('quotes')
        .update({ status: 'published', formatted_no: quoteNumber })
        .eq('id', quoteId)
        .eq('owner_id', user.id)

    if (updateError) {
        console.error('Failed to finalize quote', updateError)
        redirect('/error')
    }

    revalidatePath(`/quotes/${quoteId}`)
    revalidatePath('/quotes')
    revalidatePath('/dashboard')
    redirect(`/quotes`)
}

export async function convertQuoteToInvoice(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const quoteId = Number(formData.get('quote_id'))

    if (!quoteId) {
        console.error('Quote ID is required')
        redirect('/error')
    }

    // Vérifier l'abonnement premium
    const { data: subscriptions } = await supabase
        .from('app_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

    const hasActiveSubscription =
        subscriptions &&
        subscriptions.length > 0 &&
        ['active', 'trialing'].includes(subscriptions[0].status)

    if (!hasActiveSubscription) {
        console.error('Premium subscription required')
        redirect('/billing')
    }

    // Récupérer le devis avec ses items
    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('owner_id', user.id)
        .single()

    if (quoteError || !quote) {
        console.error('Quote not found or unauthorized', quoteError)
        redirect('/error')
    }

    // Vérifier que le devis est finalisé
    if (quote.status !== 'published') {
        console.error('Only finalized quotes can be converted to invoices')
        redirect('/error')
    }

    // Récupérer les items du devis
    const { data: quoteItems, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId)

    if (itemsError) {
        console.error('Failed to fetch quote items', itemsError)
        redirect('/error')
    }

    // Créer la facture
    const { data: insertedInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
            owner_id: user.id,
            client_id: quote.client_id,
            name: quote.name,
            description: quote.description,
            currency: quote.currency,
            terms: quote.terms,
            subtotal_cents: quote.subtotal_cents,
            tax_cents: quote.tax_cents,
            total_cents: quote.total_cents,
            status: 'draft',
            payment_date: '30 jours fin de mois',
            payment_method: 'Virement bancaire',
            interest_rate: 0,
        })
        .select('id')
        .single()

    if (invoiceError || !insertedInvoice) {
        console.error('Failed to create invoice', invoiceError)
        redirect('/error')
    }

    const invoiceId = insertedInvoice.id

    // Créer les items de la facture
    const invoiceItemsToInsert = quoteItems?.map((item) => ({
        invoice_id: invoiceId,
        description: item.description,
        type: item.type,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        total_price: item.total_price,
    }))

    if (invoiceItemsToInsert && invoiceItemsToInsert.length > 0) {
        const { error: invoiceItemsError } = await supabase
            .from('invoice_items')
            .insert(invoiceItemsToInsert)

        if (invoiceItemsError) {
            console.error('Failed to create invoice items', invoiceItemsError)
            redirect('/error')
        }
    }

    revalidatePath('/invoices')
    revalidatePath('/dashboard')
    redirect(`/invoices/${invoiceId}`)
}
