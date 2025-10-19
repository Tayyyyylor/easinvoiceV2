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
