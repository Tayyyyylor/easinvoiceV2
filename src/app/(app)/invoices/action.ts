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

function revalidateInvoice(id: number) {
    revalidatePath('/dashboard')
    revalidatePath('/invoices')
    revalidatePath(`/invoices/${id}`)
    revalidatePath(`/invoices/${id}/edit`)
}

export async function createInvoice(formData: FormData) {
    const { data, lines, invoice: fields } = readDocumentForm(formData)
    if (!(await getClient(data.client_id)))
        throw new Error(
            'Ce client est introuvable. Sélectionnez un autre client.'
        )
    const document = await saveDocument(
        'invoice',
        { ...data, ...fields(), status: 'draft' },
        lines
    )
    revalidateInvoice(document.id)
    redirect(`/invoices/${document.id}`)
}

export async function updateInvoice(formData: FormData) {
    const id = readId(formData, 'invoice_id')
    const existing = await getDocument('invoice', id)
    if (!existing) notFound()
    if (existing.status !== 'draft') redirect(`/invoices/${id}`)

    const { data, lines, invoice: fields } = readDocumentForm(formData)
    if (!(await getClient(data.client_id)))
        throw new Error(
            'Ce client est introuvable. Sélectionnez un autre client.'
        )
    await saveDocument('invoice', { ...data, ...fields() }, lines, id)
    revalidateInvoice(id)
    redirect(`/invoices/${id}`)
}

export async function finalizeInvoice(formData: FormData) {
    const id = readId(formData, 'invoice_id')
    if (!(await getDocument('invoice', id))) notFound()
    await finalizeDocument('invoice', id)
    revalidateInvoice(id)
    redirect(`/invoices/${id}`)
}
