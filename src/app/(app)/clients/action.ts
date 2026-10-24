'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { getClient, saveClient } from '@/lib/local-store'
import { readClientForm, readId } from '@/lib/local-form-data'

function revalidateClients(id?: number) {
    revalidatePath('/clients')
    revalidatePath('/dashboard')
    revalidatePath('/quotes')
    revalidatePath('/invoices')
    revalidatePath('/quotes/create')
    revalidatePath('/invoices/create')
    if (id) revalidatePath(`/clients/${id}`)
}

export async function createAClient(formData: FormData) {
    const client = await saveClient(readClientForm(formData))
    revalidateClients(client.id)
    redirect('/clients')
}

export async function createAClientAndReturn(formData: FormData) {
    try {
        const client = await saveClient(readClientForm(formData))
        revalidateClients(client.id)
        return { success: true as const, data: client }
    } catch (error) {
        return {
            success: false as const,
            error:
                error instanceof Error
                    ? error.message
                    : 'Impossible de créer le client. Réessayez.',
        }
    }
}

export async function updateClient(formData: FormData) {
    const id = readId(formData, 'client_id')
    if (!(await getClient(id))) notFound()
    await saveClient(readClientForm(formData), id)
    revalidateClients(id)
    redirect(`/clients/${id}`)
}
