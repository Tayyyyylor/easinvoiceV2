'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function finalizeAccount(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const capitalEntry = formData.get('capital')
    const capital =
        typeof capitalEntry === 'string' && capitalEntry.trim() !== ''
            ? Number(capitalEntry.replace(',', '.'))
            : null
    const id = formData.get('id') as string | null
    if (!id) {
        redirect('/error')
    }
    const data = {
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        company_name: formData.get('company_name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        capital,
        siret: formData.get('siret') as string,
    }

    const { error } = await supabase.from('profiles').update(data).eq('id', id)
    if (error) {
        redirect('/error')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
