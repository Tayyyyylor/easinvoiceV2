'use server'

/** Les comptes et mots de passe ne sont pas utilisés dans la version locale. */
export async function deleteAccount() {
    return {
        error: 'La version locale utilise des sauvegardes dans les paramètres.',
    }
}

export async function changePassword() {
    return { error: 'Aucun mot de passe n’est nécessaire en local.' }
}
