'use client'
import { DetailsTemplate } from '@/components/DetailsTemplate'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Invoices = ({ invoices }: { invoices: Invoices[] }) => {
    const router = useRouter()
    return (
        <DetailsTemplate title="Facture" data={invoices} link="invoices">
            <Button onClick={() => router.push('/invoices/create')}>
                Créer une facture
            </Button>
        </DetailsTemplate>
    )
}
