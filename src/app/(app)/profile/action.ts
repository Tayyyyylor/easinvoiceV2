'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { saveProfile } from '@/lib/local-store'
import { readProfileForm } from '@/lib/local-form-data'

export async function updateProfile(formData: FormData) {
    await saveProfile(readProfileForm(formData))
    revalidatePath('/', 'layout')
    revalidatePath('/profile')
    revalidatePath('/settings')
    revalidatePath('/dashboard')
    redirect('/profile')
}
