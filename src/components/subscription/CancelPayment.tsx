'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { XCircle, ArrowLeft, Loader2 } from 'lucide-react'

export const CancelPayment = () => {
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)
    const [redirecting, setRedirecting] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setRedirecting(true)
                    router.push('/billing')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
                    {/* Icône d'annulation */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
                        <XCircle className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-150">
                        Paiement annulé
                    </h1>

                    <p className="text-lg text-gray-700 mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        Votre paiement a été annulé.
                        <br />
                        Aucun montant n&apos;a été débité de votre compte.
                    </p>

                    {/* Informations supplémentaires */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 text-left animate-in slide-in-from-bottom-4 duration-700 delay-450">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Vous avez changé d&apos;avis ?
                        </h3>
                        <p className="text-sm text-blue-800">
                            Vous pouvez toujours souscrire à notre abonnement
                            premium plus tard pour débloquer toutes les
                            fonctionnalités.
                        </p>
                    </div>

                    {/* Compte à rebours et redirection */}
                    {redirecting ? (
                        <div className="flex items-center justify-center gap-3 text-gray-600 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Redirection...</span>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-600">
                            <p className="text-sm text-gray-500 mb-4">
                                Redirection automatique dans{' '}
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded-full font-bold text-lg mx-1">
                                    {countdown}
                                </span>
                                {countdown > 1 ? 'secondes' : 'seconde'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setRedirecting(true)
                                        router.push('/billing')
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
                                >
                                    Voir les offres d&apos;abonnement
                                </button>
                                <button
                                    onClick={() => {
                                        setRedirecting(true)
                                        router.push('/dashboard')
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Retour au dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message d'aide */}
                <p className="text-center text-sm text-gray-600 mt-6 animate-in fade-in duration-1000 delay-1000">
                    Une question ? Contactez notre support 💬
                </p>
            </div>
        </div>
    )
}
