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

export async function createQuote(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    // Support payload JSON pour valeurs issues de RHF
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

    // Validation serveur: client obligatoire
    if (!client_id) {
        console.error('createQuote validation error: client_id is required')
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

    // insert quote
    const { data: insertedQuote, error: qErr } = await supabase
        .from('quotes')
        .insert({
            owner_id: user.id,
            client_id,
            name: formData.get('name') as string,
            validity_days: validityDays,
            status: 'draft',
            description,
            currency,
            terms,
            subtotal_cents,
            tax_cents,
            total_cents,
        })
        .select('id')
        .single()

    if (qErr) {
        console.error('quote insert error', qErr)
        redirect('/error')
    }

    const quoteId = (insertedQuote as QuoteFormPayload).id

    // prepare items for insertion
    const itemsToInsert = linesArr.map((l) => ({
        quote_id: quoteId,
        description: l.description,
        type: l.type,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        total_price: l.total_price,
    }))

    // insert quote items
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

    const { data: quote, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !quote) {
        console.error('Quote not found or unauthorized', fetchError)
        redirect('/error')
    }

    const { data: items, error: itemsError } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId)
        .order('id', { ascending: true })

    if (itemsError || !items) {
        console.error('Invoice items not found or unauthorized', itemsError)
        redirect('/error')
    }

    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', quote.client_id)
        .eq('owner_id', user.id)
        .single()

    if (clientError || !client) {
        console.error('createInvoice validation error: client_id is required')
        redirect('/error')
    }

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
