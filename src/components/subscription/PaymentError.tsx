'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentError() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get('error')

    useEffect(() => {
        if (error) {
            // Log l'erreur pour le monitoring
            console.error('Erreur de paiement:', error)
        }
    }, [error])

    return error ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">
            <h3 className="font-medium">Erreur de paiement</h3>
            <p>{error}</p>
            <button
                onClick={() => router.push('/billing')}
                className="mt-2 text-red-700 hover:text-red-800"
            >
                Réessayer
            </button>
        </div>
    ) : null
}
