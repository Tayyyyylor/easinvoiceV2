'use server'

import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const { user, supabase } = await getAuthenticatedUser()
    const capitalEntry = formData.get('capital')
    const capital =
        typeof capitalEntry === 'string' && capitalEntry.trim() !== ''
            ? Number(capitalEntry.replace(',', '.'))
            : null

    const profileData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        company_name: formData.get('company_name'),
        address: formData.get('address'),
        additional_address: formData.get('additional_address'),
        city: formData.get('city'),
        zipcode: formData.get('zipcode'),
        country: formData.get('country'),
        logo_url: formData.get('logo_url'),
        capital,
        siret: formData.get('siret'),
        updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)

    if (updateError) {
        throw new Error('Erreur lors de la mise à jour du profil')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
