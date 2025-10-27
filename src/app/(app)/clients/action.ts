'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export async function createAClient(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const payload = {
        owner_id: user.id,
        type: formData.get('type') as 'company' | 'individual',
        email: formData.get('email') as string,
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        company_name: formData.get('company_name') as string,
        address: formData.get('address') as string,
        additional_address: formData.get('additional_address') as string,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        country: formData.get('country') as string,
        phone: formData.get('phone') as string,
        siret: formData.get('siret') as string,
        naf_code: formData.get('naf_code') as string,
    }

    const { error } = await supabase.from('clients').insert(payload)
    if (error) {
        console.log('error', error)
        console.error('createCustomer error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        })
    }

    revalidatePath('/clients')
    redirect('/clients')
}

export async function createAClientAndReturn(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const payload = {
        owner_id: user.id,
        type: formData.get('type') as 'company' | 'individual',
        email: formData.get('email') as string,
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        company_name: formData.get('company_name') as string,
        address: formData.get('address') as string,
        additional_address: formData.get('additional_address') as string,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        country: formData.get('country') as string,
        phone: formData.get('phone') as string,
        siret: formData.get('siret') as string,
        naf_code: formData.get('naf_code') as string,
    }

    const { data, error } = await supabase
        .from('clients')
        .insert(payload)
        .select()
        .single()

    if (error) {
        console.log('error', error)
        console.error('createCustomer error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        })
        return { success: false, error: error.message }
    }

    revalidatePath('/clients')
    revalidatePath('/quotes/create')
    revalidatePath('/invoices/create')
    return { success: true, data }
}

export async function updateClient(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()

    const clientId = Number(formData.get('client_id'))

    if (!clientId) {
        console.error('Client ID is required')
        redirect('/error')
    }

    const { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', clientId)
        .eq('owner_id', user.id)
        .single()

    if (fetchError || !existingClient) {
        console.error('Client not found or unauthorized', fetchError)
        redirect('/error')
    }

    let payload: ClientFormPayload | null = null
    if (formData.get('payload')) {
        try {
            payload = JSON.parse(formData.get('payload') as string)
        } catch (e) {
            console.error('invalid payload json', e)
        }
    }

    if (!payload) {
        console.error('No payload provided')
        redirect('/error')
    }

    const { error: updateError } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', clientId)
        .eq('owner_id', user.id)

    if (updateError) {
        console.error('Update client error:', {
            code: updateError.code,
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
        })
        redirect('/error')
    }

    revalidatePath(`/clients/${clientId}`)
    revalidatePath('/clients')
    redirect(`/clients/${clientId}`)
}
