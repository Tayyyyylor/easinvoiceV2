'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function finalizeAccount(formData: FormData) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const capitalEntry = formData.get('capital')
    const capital =
        typeof capitalEntry === 'string' && capitalEntry.trim() !== ''
            ? Number(capitalEntry.replace(',', '.'))
            : null
    const data = {
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        company_name: formData.get('company_name') as string,
        address: formData.get('address') as string,
        additional_address: formData.get('additional_address') as string,
        city: formData.get('city') as string,
        zipcode: formData.get('zipcode') as string,
        country: formData.get('country') as string,
        capital,
        siret: formData.get('siret') as string,
    }
    console.log('data', data)

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...data,
    })
    if (error) {
        console.log(error)
        console.error('error', error)
        redirect('/error')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
