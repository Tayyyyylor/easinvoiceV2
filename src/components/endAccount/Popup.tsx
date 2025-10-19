'use client'
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface PopupProps {
    onClose: () => void
}

export const Popup = ({ onClose }: PopupProps) => {
    const router = useRouter()
    const handleClickFinalize = () => {
        router.push('/finalizeAccount')
    }
    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center ">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-sm bg-white text-black">
                <CardHeader>
                    <CardTitle>Finaliser le profil</CardTitle>
                    <CardAction>
                        <Button type="button" onClick={onClose}>
                            Fermer
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    Finaliser le profil pour pouvoir profiter de toutes les
                    fonctionnalités de l&apos;application
                </CardContent>
                <CardFooter>
                    <Button type="button" onClick={onClose}>
                        Plus tard
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleClickFinalize}
                    >
                        Finaliser le profil
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
