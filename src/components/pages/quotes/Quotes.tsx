'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DetailsCard } from '@/components/atoms/DetailsCard'

type FilterStatus = 'all' | 'draft' | 'published'

export const Quotes = ({ quotes }: { quotes: Quotes[] }) => {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterStatus>('all')

    const filteredQuotes = useMemo(() => {
        if (filter === 'all') return quotes
        return quotes.filter((quote) => quote.status === filter)
    }, [quotes, filter])

    const getButtonClass = (status: FilterStatus) => {
        const baseClass = 'border px-3 py-1 rounded transition-colors'
        return filter === status
            ? `${baseClass} bg-black text-white`
            : `${baseClass} hover:bg-gray-100`
    }

    console.log('quotes', quotes)
    return (
        <main className="flex flex-col gap-4 max-w-4xl mx-auto p-4 border h-screen">
            <article className="flex gap-2 justify-center items-center">
                <button
                    className={getButtonClass('all')}
                    onClick={() => setFilter('all')}
                >
                    Tous les devis
                </button>
                <button
                    className={getButtonClass('draft')}
                    onClick={() => setFilter('draft')}
                >
                    Devis provisoires
                </button>
                <button
                    className={getButtonClass('published')}
                    onClick={() => setFilter('published')}
                >
                    Devis finalisés
                </button>
            </article>
            <article>
                {filteredQuotes.map((quote) => (
                    <DetailsCard
                        key={quote.id}
                        title={quote.name}
                        name={quote.name}
                        price={quote.total_cents / 100}
                        created_at={quote.created_at}
                        status_label={quote.status}
                        onClick={() => router.push(`/quotes/${quote.id}`)}
                    />
                ))}
            </article>
            <Button onClick={() => router.push('/quotes/create')}>
                Créer un devis
            </Button>
        </main>
    )
}
