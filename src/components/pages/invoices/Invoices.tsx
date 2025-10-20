'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DetailsCard } from '@/components/atoms/DetailsCard'

type FilterStatus = 'all' | 'draft' | 'published'

export const Invoices = ({ invoices }: { invoices: Invoices[] }) => {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterStatus>('all')

    const filteredInvoices = useMemo(() => {
        if (filter === 'all') return invoices
        return invoices.filter((invoice) => invoice.status === filter)
    }, [invoices, filter])

    const getButtonClass = (status: FilterStatus) => {
        const baseClass = 'border px-3 py-1 rounded transition-colors'
        return filter === status
            ? `${baseClass} bg-black text-white`
            : `${baseClass} hover:bg-gray-100`
    }

    return (
        <main className="flex flex-col gap-4 max-w-4xl mx-auto p-4 border h-screen">
            <article className="flex gap-2 justify-center items-center">
                <button
                    className={getButtonClass('all')}
                    onClick={() => setFilter('all')}
                >
                    Toutes les factures
                </button>
                <button
                    className={getButtonClass('draft')}
                    onClick={() => setFilter('draft')}
                >
                    Factures provisoires
                </button>
                <button
                    className={getButtonClass('published')}
                    onClick={() => setFilter('published')}
                >
                    Factures finalisées
                </button>
            </article>
            <article>
                {filteredInvoices.map((invoice) => (
                    <DetailsCard
                        key={invoice.id}
                        title={invoice.name}
                        name={invoice.formatted_no}
                        price={invoice.total_cents / 100}
                        created_at={invoice.created_at}
                        status_label={invoice.status}
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                    />
                ))}
            </article>
            <Button onClick={() => router.push('/invoices/create')}>
                Créer une facture
            </Button>
        </main>
    )
}
