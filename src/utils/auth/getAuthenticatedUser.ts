import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Récupère l'utilisateur authentifié et redirige vers /login si non connecté
 * @returns {Promise<{user: User, supabase: SupabaseClient}>} L'utilisateur et le client Supabase
 */
export async function getAuthenticatedUser() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return { user, supabase }
}
