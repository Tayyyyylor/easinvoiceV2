'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

type AuthState = {
    error?: string
} | null

export async function login(prevState: AuthState, formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        // Retourner le message d'erreur exact de Supabase
        console.log('Supabase error:', error)
        return {
            error: error.message,
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(prevState: AuthState, formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // On essaie de se connecter d'abord pour vérifier si l'email existe
    const { error: signInError } = await supabase.auth.signInWithPassword(data)

    if (!signInError) {
        // Si on peut se connecter, c'est que l'email existe déjà
        return {
            error: 'Cet email est déjà utilisé',
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log('Supabase signup error:', error)
        // Retourner le message d'erreur exact de Supabase
        return {
            error: error.message,
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}
