'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import {
    finalizeDocument,
    getClient,
    getDocument,
    saveDocument,
} from '@/lib/local-store'
import { readDocumentForm, readId } from '@/lib/local-form-data'

function revalidateQuote(id: number) {
    revalidatePath('/dashboard')
    revalidatePath('/quotes')
    revalidatePath(`/quotes/${id}`)
    revalidatePath(`/quotes/${id}/edit`)
}

export async function createQuote(formData: FormData) {
    const { data, lines, quote: fields } = readDocumentForm(formData)
    if (!(await getClient(data.client_id)))
        throw new Error(
            'Ce client est introuvable. Sélectionnez un autre client.'
        )
    const document = await saveDocument(
        'quote',
        { ...data, ...fields(), status: 'draft' },
        lines
    )
    revalidateQuote(document.id)
    redirect(`/quotes/${document.id}`)
}

export async function updateQuote(formData: FormData) {
    const id = readId(formData, 'quote_id')
    const existing = await getDocument('quote', id)
    if (!existing) notFound()
    if (existing.status !== 'draft') redirect(`/quotes/${id}`)

    const { data, lines, quote: fields } = readDocumentForm(formData)
    if (!(await getClient(data.client_id)))
        throw new Error(
            'Ce client est introuvable. Sélectionnez un autre client.'
        )
    await saveDocument('quote', { ...data, ...fields() }, lines, id)
    revalidateQuote(id)
    redirect(`/quotes/${id}`)
}

export async function finalizeQuote(formData: FormData) {
    const id = readId(formData, 'quote_id')
    if (!(await getDocument('quote', id))) notFound()
    await finalizeDocument('quote', id)
    revalidateQuote(id)
    redirect(`/quotes/${id}`)
}
