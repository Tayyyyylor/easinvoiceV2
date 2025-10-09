'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

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
