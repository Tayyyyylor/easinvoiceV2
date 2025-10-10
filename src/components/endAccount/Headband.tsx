'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export const Headband = () => {
    const router = useRouter()
    return (
        <div className="flex justify-center items-center gap-10 border border-gray-200 p-3">
            <p>
                Finaliser le profil pour pouvoir profiter de toutes les
                fonctionnalités de l&apos;application
            </p>
            <Button
                variant="outline"
                onClick={() => router.push('/finalizeAccount')}
            >
                Finir le profil
            </Button>
        </div>
    )
}
