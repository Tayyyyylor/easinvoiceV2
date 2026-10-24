/** Read the logo locally; it is persisted with the profile when the form is saved. */
export function readLogo(file: File): Promise<string> {
    if (file.size > 2 * 1024 * 1024) {
        return Promise.reject(
            new Error('Le fichier est trop volumineux (max 2 Mo).')
        )
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        return Promise.reject(new Error('Choisissez un logo PNG ou JPG.'))
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Impossible de lire le logo.'))
        reader.readAsDataURL(file)
    })
}
