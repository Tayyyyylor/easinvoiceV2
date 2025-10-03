'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export const Quotes = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center">
            <Button onClick={() => router.push('/quotes/create')}>
                Créer un devis
            </Button>
        </div>
    )
}
