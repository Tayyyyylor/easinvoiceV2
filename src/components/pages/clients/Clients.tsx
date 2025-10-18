'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DetailsTemplate } from '@/components/DetailsTemplate'

export const Clients = ({ clients }: { clients: Clients[] }) => {
    const router = useRouter()
    return (
        <DetailsTemplate title="Clients" data={clients} link="clients">
            <Button onClick={() => router.push('/clients/create')}>
                Créer un client
            </Button>
        </DetailsTemplate>
    )
}
