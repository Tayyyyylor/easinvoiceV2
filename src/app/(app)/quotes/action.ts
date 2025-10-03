'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function createQuote(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const capitalEntry = formData.get('buyer.client_capital')
    const capital =
        typeof capitalEntry === 'string' && capitalEntry.trim() !== ''
            ? Number(capitalEntry.replace(',', '.'))
            : null
    const id = formData.get('id') as string | null
    if (!id) {
        redirect('/error')
    }
    const data = {
        buyer: {
            client_name: formData.get('buyer.client_name') as string,
            client_address: formData.get('buyer.client_address') as string,
            client_city: formData.get('buyer.client_city') as string,
            client_zipcode: formData.get('buyer.client_zipcode') as string,
            client_capital: capital,
            client_siret: formData.get('buyer.client_siret') as string,
        },
        lines: formData.get('lines') as string,
        notes: formData.get('notes') as string,
        terms: formData.get('terms') as string,
    }

    const { error } = await supabase.from('profiles').update(data).eq('id', id)
    if (error) {
        redirect('/error')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
