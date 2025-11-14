'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SuccessPayment() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        // Compte à rebours avant redirection
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/dashboard')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Paiement réussi
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Votre paiement a été réussi. Vous pouvez maintenant
                        accéder à toutes les fonctionnalités premium.
                    </p>

                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Prochaines étapes
                        </h2>
                        <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    Vous avez accès à toutes les fonctionnalités
                                    premium
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    Un email de confirmation a été envoyé
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                <span>
                                    Vous pouvez gérer votre abonnement depuis
                                    votre tableau de bord
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Bouton de redirection */}
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            Aller au tableau de bord
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        {/* Compte à rebours */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirection automatique dans {countdown}s...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
