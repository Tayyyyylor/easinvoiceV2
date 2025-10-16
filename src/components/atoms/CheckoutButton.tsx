'use client'
import { useState } from 'react'

export default function CheckoutButton({
    priceId,
    supabaseUserId,
}: {
    priceId: string
    supabaseUserId: string
}) {
    const [loading, setLoading] = useState(false)

    async function handleCheckout() {
        setLoading(true)
        const res = await fetch('/api/checkout/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, supabaseUserId }),
        })
        const data = await res.json()
        if (data?.url) {
            // redirige vers Stripe Checkout hébergé
            window.location.href = data.url
        } else {
            console.error(data)
            setLoading(false)
            alert('Erreur création session checkout')
        }
    }

    return (
        <button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Redirection...' : 'S’abonner'}
        </button>
    )
}
