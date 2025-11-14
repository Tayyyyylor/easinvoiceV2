'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

interface PopupProps {
    onClose: () => void
}

export const Popup = ({ onClose }: PopupProps) => {
    const router = useRouter()
    const handleClickFinalize = () => {
        router.push('/finalizeAccount')
    }

    const benefits = [
        'Créer des devis et factures professionnels',
        'Gérer vos clients efficacement',
        'Accéder à toutes les fonctionnalités',
        'Personnaliser vos documents avec votre logo',
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay avec blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header avec gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 rounded-t-2xl">
                    {/* Motif décoratif */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={onClose}
                            className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                Finalisez votre profil
                            </h2>
                        </div>
                        <p className="text-amber-50 text-sm">
                            Déverrouillez tout le potentiel de la plateforme
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-6">
                        Complétez votre profil en quelques minutes pour accéder
                        à toutes les fonctionnalités :
                    </p>

                    {/* Liste des bénéfices */}
                    <div className="space-y-3 mb-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-700">
                                    {benefit}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleClickFinalize}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-12 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 group"
                        >
                            Finaliser maintenant
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            Plus tard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
