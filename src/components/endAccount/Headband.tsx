'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react'

export const Headband = () => {
    const router = useRouter()
    return (
        <div className="relative overflow-hidden">
            {/* Dégradé de fond */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50"></div>

            {/* Motif décoratif */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 p-4 md:p-5 border-l-4 border-amber-500">
                <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            Profil incomplet
                        </h3>
                        <p className="text-sm text-gray-700">
                            Finalisez votre profil pour débloquer toutes les
                            fonctionnalités de l&apos;application et créer vos
                            premiers documents.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push('/finalizeAccount')}
                    className="whitespace-nowrap bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg flex items-center gap-2 group"
                >
                    Finaliser mon profil
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    )
}
