'use client'
import { Popup } from '../endAccount/Popup'
import { useState, useMemo } from 'react'
import { Headband } from '../endAccount/Headband'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '../ui/button'
import { AdLayout } from '../layouts/AdLayout'
import {
    FileText,
    FilePlus,
    Users,
    TrendingUp,
    FileCheck,
    FileClock,
    UserPlus,
    FileBarChart,
} from 'lucide-react'

interface DashboardProps {
    clients: Clients[]
    quotes: Quotes[]
    invoices: Invoices[]
}

export default function Dashboard({
    clients,
    quotes,
    invoices,
}: DashboardProps) {
    const [showPopup, setShowPopup] = useState(true)
    const { isSubscribed } = useSubscription()
    const { profile } = useAuth()
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname
    const handleClick = () => {
        setShowPopup(true)
    }

    // Calcul des statistiques
    const stats = useMemo(() => {
        const totalInvoices = invoices.length
        const publishedInvoices = invoices.filter(
            (inv) => inv.status === 'published'
        ).length
        const draftInvoices = invoices.filter(
            (inv) => inv.status === 'draft'
        ).length
        const totalQuotes = quotes.length
        const publishedQuotes = quotes.filter(
            (q) => q.status === 'published'
        ).length

        return {
            totalInvoices,
            publishedInvoices,
            draftInvoices,
            totalQuotes,
            publishedQuotes,
            totalClients: clients.length,
        }
    }, [invoices, quotes, clients])

    const quickActions = [
        {
            title: 'Créer une facture',
            description: 'Générez une nouvelle facture',
            icon: <FilePlus className="w-8 h-8" />,
            gradient: 'from-blue-500 to-blue-600',
            hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
            onClick: isProfileCompleted
                ? () => router.push('/invoices/create')
                : handleClick,
        },
        {
            title: 'Créer un devis',
            description: 'Préparez un nouveau devis',
            icon: <FileBarChart className="w-8 h-8" />,
            gradient: 'from-purple-500 to-purple-600',
            hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
            onClick: isProfileCompleted
                ? () => router.push('/quotes/create')
                : handleClick,
        },
        {
            title: 'Ajouter un client',
            description: 'Enregistrez un nouveau client',
            icon: <UserPlus className="w-8 h-8" />,
            gradient: 'from-green-500 to-green-600',
            hoverGradient: 'hover:from-green-600 hover:to-green-700',
            onClick: isProfileCompleted
                ? () => router.push('/clients/create')
                : handleClick,
        },
    ]

    return (
        <AdLayout>
            <div className="space-y-6">
                {!isProfileCompleted && <Headband />}
                {!isSubscribed && (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => router.push('/billing')}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg"
                        >
                            ✨ Passez Premium !
                        </Button>
                    </div>
                )}

                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Bienvenue{' '}
                        {profile?.firstname ? `, ${profile.firstname}` : ''} !
                        👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Voici un aperçu de votre activité
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Factures */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.totalInvoices}
                            </span>
                        </div>
                        <h3 className="text-gray-600 font-medium">
                            Factures totales
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.publishedInvoices} publiées,{' '}
                            {stats.draftInvoices} brouillons
                        </p>
                    </div>

                    {/* Factures Publiées */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.publishedInvoices}
                            </span>
                        </div>
                        <h3 className="text-gray-600 font-medium">
                            Factures publiées
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Prêtes à être envoyées
                        </p>
                    </div>

                    {/* Devis */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FileClock className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.totalQuotes}
                            </span>
                        </div>
                        <h3 className="text-gray-600 font-medium">
                            Devis totaux
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.publishedQuotes} publiés
                        </p>
                    </div>

                    {/* Clients */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.totalClients}
                            </span>
                        </div>
                        <h3 className="text-gray-600 font-medium">Clients</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Dans votre portefeuille
                        </p>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Actions rapides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`bg-gradient-to-br ${action.gradient} ${action.hoverGradient} text-white rounded-2xl shadow-lg p-8 transition-all transform hover:scale-105 hover:shadow-xl group`}
                            >
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        {action.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">
                                            {action.title}
                                        </h3>
                                        <p className="text-white/90 text-sm">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listes Récentes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Factures Récentes */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Factures récentes
                            </h3>
                            <button
                                onClick={
                                    isProfileCompleted
                                        ? () => router.push('/invoices')
                                        : handleClick
                                }
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Voir tout →
                            </button>
                        </div>
                        <div className="space-y-2">
                            {invoices.slice(0, 5).map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    onClick={() =>
                                        router.push(`/invoices/${invoice.id}`)
                                    }
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">
                                            {invoice.formatted_no}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {invoice.name}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            invoice.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {invoice.status === 'published'
                                            ? 'Publiée'
                                            : 'Brouillon'}
                                    </span>
                                </div>
                            ))}
                            {invoices.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Aucune facture pour le moment
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Devis Récents */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileBarChart className="w-5 h-5 text-purple-600" />
                                Devis récents
                            </h3>
                            <button
                                onClick={
                                    isProfileCompleted
                                        ? () => router.push('/quotes')
                                        : handleClick
                                }
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                Voir tout →
                            </button>
                        </div>
                        <div className="space-y-2">
                            {quotes.slice(0, 5).map((quote) => (
                                <div
                                    key={quote.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    onClick={() =>
                                        router.push(`/quotes/${quote.id}`)
                                    }
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">
                                            {quote.formatted_no}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {quote.name}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            quote.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {quote.status === 'published'
                                            ? 'Publié'
                                            : 'Brouillon'}
                                    </span>
                                </div>
                            ))}
                            {quotes.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Aucun devis pour le moment
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Clients Récents */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-600" />
                                Clients récents
                            </h3>
                            <button
                                onClick={
                                    isProfileCompleted
                                        ? () => router.push('/clients')
                                        : handleClick
                                }
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                                Voir tout →
                            </button>
                        </div>
                        <div className="space-y-2">
                            {clients.slice(0, 5).map((client) => (
                                <div
                                    key={client.id}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    onClick={() =>
                                        router.push(`/clients/${client.id}`)
                                    }
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {client.firstname?.[0]}
                                        {client.lastname?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">
                                            {client.firstname} {client.lastname}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {client.company_name ||
                                                client.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {clients.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Aucun client pour le moment
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Popup */}
                {showPopup && !isProfileCompleted && (
                    <Popup onClose={() => setShowPopup(false)} />
                )}
            </div>
        </AdLayout>
    )
}
