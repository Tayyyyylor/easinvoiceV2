'use client'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { AdLayout } from '@/components/layouts/AdLayout'
import { useRouter } from 'next/navigation'
import {
    Settings as SettingsIcon,
    User,
    Mail,
    Calendar,
    Crown,
    CreditCard,
    Shield,
    Trash2,
    AlertTriangle,
    Check,
    X,
    Loader2,
    ExternalLink,
} from 'lucide-react'

export const Settings = () => {
    const router = useRouter()
    const { user, profile } = useAuth()
    const { isSubscribed, isLoading: subscriptionLoading } = useSubscription()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        // TODO: Implémenter la suppression de compte
        // await deleteAccount()
        console.log('Suppression du compte...')
        setTimeout(() => {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }, 2000)
    }

    const handleManageSubscription = () => {
        // Rediriger vers le portail de gestion Stripe
        router.push('/billing')
    }

    return (
        <AdLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <SettingsIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Paramètres
                            </h1>
                            <p className="text-gray-600">
                                Gérez votre compte et vos préférences
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Abonnement */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Crown className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">
                                Abonnement
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {subscriptionLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                            </div>
                        ) : isSubscribed ? (
                            <>
                                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <Check className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-900">
                                                Plan Premium Actif
                                            </p>
                                            <p className="text-sm text-green-700">
                                                Vous bénéficiez de toutes les
                                                fonctionnalités premium
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold">
                                        Actif
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleManageSubscription}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Gérer l&apos;abonnement
                                    </button>
                                    <button
                                        onClick={handleManageSubscription}
                                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Voir mes factures
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <X className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Plan Gratuit
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Passez à Premium pour débloquer
                                                toutes les fonctionnalités
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold">
                                        Gratuit
                                    </span>
                                </div>

                                <button
                                    onClick={() => router.push('/billing')}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Crown className="w-5 h-5" />
                                    Passer à Premium
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Section Informations du compte */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <User className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">
                                Informations du compte
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-900">
                                    {user?.email || 'Non renseigné'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                    Membre depuis
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {user?.created_at
                                        ? formatDate(user.created_at)
                                        : 'Non disponible'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/profile/edit')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <User className="w-5 h-5" />
                            Modifier mon profil
                        </button>
                    </div>
                </div>

                {/* Section Sécurité */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">
                                Sécurité
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-3">
                                Protégez votre compte en mettant régulièrement à
                                jour votre mot de passe.
                            </p>
                            <button
                                onClick={() => {
                                    // TODO: Implémenter le changement de mot de passe
                                    console.log('Changer le mot de passe')
                                }}
                                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Shield className="w-5 h-5" />
                                Changer mon mot de passe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Danger Zone */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-200">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">
                                Zone de danger
                            </h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-red-900 mb-1">
                                        Supprimer définitivement mon compte
                                    </p>
                                    <p className="text-sm text-red-700">
                                        Cette action est irréversible. Toutes
                                        vos données (devis, factures, clients)
                                        seront définitivement supprimées.
                                    </p>
                                </div>
                            </div>

                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Supprimer mon compte
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                                        <p className="text-sm font-semibold text-red-900 text-center">
                                            ⚠️ Êtes-vous absolument sûr(e) ?
                                            Cette action est définitive !
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Suppression...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-5 h-5" />
                                                    Oui, supprimer
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowDeleteConfirm(false)
                                            }
                                            disabled={isDeleting}
                                            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdLayout>
    )
}
