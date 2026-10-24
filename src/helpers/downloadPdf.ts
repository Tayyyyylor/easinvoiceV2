export async function downloadPdf(endpoint: string, fallbackFilename: string) {
    const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: { Accept: 'application/pdf' },
    })

    if (!response.ok) {
        const result: { error?: unknown } | null = await response
            .json()
            .catch(() => null)
        throw new Error(
            typeof result?.error === 'string'
                ? result.error
                : 'Impossible de générer le PDF. Réessayez dans quelques instants.'
        )
    }
    if (!response.headers.get('content-type')?.includes('application/pdf')) {
        throw new Error(
            'Le serveur n’a pas renvoyé un PDF valide. Réessayez le téléchargement.'
        )
    }

    const blob = await response.blob()
    if (!blob.size)
        throw new Error('Le PDF généré est vide. Réessayez le téléchargement.')

    const filename =
        response.headers
            .get('content-disposition')
            ?.match(/filename="([^"]+)"/i)?.[1] || fallbackFilename
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename.replace(/[\\/:*?"<>|]/g, '-')
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
