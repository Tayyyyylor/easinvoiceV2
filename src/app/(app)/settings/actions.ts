'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Supprime définitivement le compte utilisateur et toutes ses données
 */
export async function deleteAccount() {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('User not authenticated', authError)
        redirect('/login')
    }

    try {
        // 1. Supprimer tous les quote_items de l'utilisateur
        const { data: quotes } = await supabase
            .from('quotes')
            .select('id')
            .eq('owner_id', user.id)

        if (quotes && quotes.length > 0) {
            const quoteIds = quotes.map((q) => q.id)
            await supabase.from('quote_items').delete().in('quote_id', quoteIds)
        }

        // 2. Supprimer tous les invoice_items de l'utilisateur
        const { data: invoices } = await supabase
            .from('invoices')
            .select('id')
            .eq('owner_id', user.id)

        if (invoices && invoices.length > 0) {
            const invoiceIds = invoices.map((i) => i.id)
            await supabase
                .from('invoice_items')
                .delete()
                .in('invoice_id', invoiceIds)
        }

        // 3. Supprimer tous les devis
        await supabase.from('quotes').delete().eq('owner_id', user.id)

        // 4. Supprimer toutes les factures
        await supabase.from('invoices').delete().eq('owner_id', user.id)

        // 5. Supprimer tous les clients
        await supabase.from('clients').delete().eq('owner_id', user.id)

        // 6. Supprimer les abonnements
        await supabase.from('app_subscriptions').delete().eq('user_id', user.id)

        // 7. Supprimer le profil
        await supabase.from('profiles').delete().eq('id', user.id)

        // 8. Supprimer l'utilisateur de l'auth (si vous avez les permissions)
        // Note: Cette action nécessite des permissions d'admin
        // await supabase.auth.admin.deleteUser(user.id)

        // 9. Déconnecter l'utilisateur
        await supabase.auth.signOut()

        console.log('Account deleted successfully')
    } catch (error) {
        console.error('Error deleting account:', error)
        throw new Error('Erreur lors de la suppression du compte')
    }

    redirect('/login')
}

/**
 * Change le mot de passe de l'utilisateur
 */
export async function changePassword(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('User not authenticated', authError)
        return { error: 'Utilisateur non authentifié' }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'Tous les champs sont requis' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Les nouveaux mots de passe ne correspondent pas' }
    }

    if (newPassword.length < 8) {
        return {
            error: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
        }
    }

    // Vérifier le mot de passe actuel en tentant de se reconnecter
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
    })

    if (signInError) {
        return { error: 'Mot de passe actuel incorrect' }
    }

    // Changer le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (updateError) {
        console.error('Error updating password:', updateError)
        return { error: 'Erreur lors du changement de mot de passe' }
    }

    return { success: true, message: 'Mot de passe modifié avec succès' }
}
