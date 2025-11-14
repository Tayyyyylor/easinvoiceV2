'use client'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FilterButtons, FilterOption } from '@/components/atoms/FilterButtons'
import { AdLayout } from '@/components/layouts/AdLayout'
import { Building2, User, Mail, Phone, Plus } from 'lucide-react'

type FilterStatus = 'all' | 'company' | 'individual'

export const Clients = ({ clients }: { clients: Clients[] }) => {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterStatus>('all')

    const filteredClients = useMemo(() => {
        if (filter === 'all') return clients
        return clients.filter((client) => client.type === filter)
    }, [clients, filter])

    const filterOptions: FilterOption<FilterStatus>[] = [
        { value: 'all', label: 'Tous les clients' },
        { value: 'company', label: 'Professionnels' },
        { value: 'individual', label: 'Particuliers' },
    ]

    return (
        <AdLayout>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Mes Clients
                            </h1>
                            <p className="text-gray-600">
                                {filteredClients.length}{' '}
                                {filteredClients.length > 1
                                    ? 'clients'
                                    : 'client'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/clients/create')}
                        className="px-6 py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Créer un client
                    </Button>
                </div>

                {/* Filtres */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <FilterButtons
                        options={filterOptions}
                        currentFilter={filter}
                        onFilterChange={setFilter}
                    />
                </div>
            </div>

            {/* Liste des clients */}
            <div className="grid md:grid-cols-2 gap-4">
                {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                        <button
                            key={client.id}
                            onClick={() => router.push(`/clients/${client.id}`)}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all transform hover:scale-[1.02] cursor-pointer group text-left"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        client.type === 'company'
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                            : 'bg-gradient-to-br from-green-500 to-teal-600'
                                    }`}
                                >
                                    {client.type === 'company' ? (
                                        <Building2 className="w-7 h-7 text-white" />
                                    ) : (
                                        <User className="w-7 h-7 text-white" />
                                    )}
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                                            {client.company_name ||
                                                `${client.firstname} ${client.lastname}`}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                client.type === 'company'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {client.type === 'company'
                                                ? 'Pro'
                                                : 'Part.'}
                                        </span>
                                    </div>

                                    {client.type === 'company' &&
                                        client.company_name && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                {client.firstname}{' '}
                                                {client.lastname}
                                            </p>
                                        )}

                                    <div className="space-y-1.5 mt-3">
                                        {client.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">
                                                    {client.email}
                                                </span>
                                            </div>
                                        )}
                                        {client.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{client.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Aucun client trouvé
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Commencez par ajouter votre premier client
                        </p>
                        <Button
                            onClick={() => router.push('/clients/create')}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Créer un client
                        </Button>
                    </div>
                )}
            </div>
        </AdLayout>
    )
}
