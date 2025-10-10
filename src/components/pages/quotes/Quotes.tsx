'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const Quotes = ({ quotes }: { quotes: Quotes[] }) => {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Devis</h1>
            <div className="flex flex-col items-center justify-center">
                {quotes.map((quote) => (
                    <div
                        key={quote.id}
                        onClick={() => router.push(`/quotes/${quote.id}`)}
                        className="pointer"
                    >
                        <h2 className="text-lg font-bold">{quote.name}</h2>
                        <p className="text-sm text-gray-500">
                            {quote.description}
                        </p>
                        <p className="text-sm text-gray-500">
                            {quote.created_at}
                        </p>
                    </div>
                ))}
            </div>
            <Button onClick={() => router.push('/quotes/create')}>
                Créer un devis
            </Button>
        </div>
    )
}
