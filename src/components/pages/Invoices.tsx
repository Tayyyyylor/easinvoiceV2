'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

export const Invoices = ({ invoices }: { invoices: any[] }) => {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Facture</h1>
            <div className="flex flex-col items-center justify-center">
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                        className="pointer"
                    >
                        <h2 className="text-lg font-bold">{invoice.name}</h2>
                        <p className="text-sm text-gray-500">
                            {invoice.description}
                        </p>
                        <p className="text-sm text-gray-500">
                            {invoice.created_at}
                        </p>
                    </div>
                ))}
            </div>
            <Button onClick={() => router.push('/invoices/create')}>
                Créer une facture
            </Button>
        </div>
    )
}
