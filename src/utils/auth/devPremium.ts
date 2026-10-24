// Comptes considérés premium en développement local uniquement (next dev)
const DEV_PREMIUM_EMAILS = ['tati@tati.com']

export function isDevPremium(email?: string | null) {
    return (
        process.env.NODE_ENV === 'development' &&
        !!email &&
        DEV_PREMIUM_EMAILS.includes(email.toLowerCase())
    )
}
