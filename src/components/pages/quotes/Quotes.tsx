'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { DetailsTemplate } from '@/components/DetailsTemplate'
import { Button } from '@/components/ui/button'

export const Quotes = ({ quotes }: { quotes: Quotes[] }) => {
    const router = useRouter()
    return (
        <DetailsTemplate title="Devis" data={quotes} link="quotes">
            <Button onClick={() => router.push('/quotes/create')}>
                Créer un devis
            </Button>
        </DetailsTemplate>
    )
}
