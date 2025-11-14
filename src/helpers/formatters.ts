/**
 * Formate une date au format court français (jj/mm/aaaa)
 */
export const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

/**
 * Formate une date au format long français (jj mois aaaa)
 */
export const formatDateLong = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

/**
 * Formate un montant en euros
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(price)
}

/**
 * Formate un montant en centimes vers euros
 */
export const formatPriceFromCents = (cents: number): string => {
    return formatPrice(cents / 100)
}
