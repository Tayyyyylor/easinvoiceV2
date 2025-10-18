import { createClient } from './client'

/**
 * Upload un logo pour l'utilisateur connecté
 * Le fichier est stocké dans le dossier {userId}/logo.{ext}
 * Si un logo existe déjà, il est remplacé (upsert: true)
 */
export async function uploadLogo(file: File, userId: string) {
    const supabase = createClient()

    // Validation de la taille du fichier (2MB max)
    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('Le fichier est trop volumineux (max 2MB)')
    }

    // Validation du type MIME
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
            'Type de fichier non autorisé (PNG, JPG ou WEBP uniquement)'
        )
    }

    // Structure: userId/logo.{ext}
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filePath = `${userId}/logo.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // Remplace l'ancien logo s'il existe
        })

    if (uploadError) {
        throw uploadError
    }

    // Récupérer l'URL publique
    const {
        data: { publicUrl },
    } = supabase.storage.from('logos').getPublicUrl(filePath)

    return publicUrl
}

/**
 * Supprime le logo de l'utilisateur connecté
 * @param url L'URL complète du logo ou le chemin du fichier
 */
export async function deleteLogo(url: string, userId: string) {
    const supabase = createClient()

    // Extraire le chemin du fichier (soit depuis l'URL, soit utiliser le userId)
    let filePath: string

    if (url.includes('/storage/v1/object/public/logos/')) {
        // Si c'est une URL complète, extraire le chemin
        const urlParts = url.split('/storage/v1/object/public/logos/')
        filePath = urlParts[1] || ''
    } else {
        // Sinon, utiliser le userId pour construire le chemin
        filePath = url
    }

    if (!filePath) {
        throw new Error('Chemin de fichier invalide')
    }

    // Vérifier que le fichier appartient bien à l'utilisateur
    if (!filePath.startsWith(userId)) {
        throw new Error('Non autorisé à supprimer ce fichier')
    }

    const { error } = await supabase.storage.from('logos').remove([filePath])

    if (error) {
        throw error
    }
}

/**
 * Récupère l'URL du logo de l'utilisateur
 */
export async function getLogoUrl(userId: string, fileExt: string = 'png') {
    const supabase = createClient()

    const filePath = `${userId}/logo.${fileExt}`

    // Vérifier si le fichier existe
    const { data, error } = await supabase.storage.from('logos').list(userId)

    if (error || !data || data.length === 0) {
        return null
    }

    // Récupérer l'URL publique
    const {
        data: { publicUrl },
    } = supabase.storage.from('logos').getPublicUrl(filePath)

    return publicUrl
}

/**
 * Liste tous les logos d'un utilisateur (utile si vous autorisez plusieurs logos)
 */
export async function listUserLogos(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase.storage.from('logos').list(userId)

    if (error) {
        throw error
    }

    return data
}
