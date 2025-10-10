'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const Clients = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center">
            <Button onClick={() => router.push('/clients/create')}>
                Créer un client
            </Button>
        </div>
    )
}
