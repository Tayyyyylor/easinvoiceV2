'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AdLayout } from '@/components/layouts/AdLayout'
import {
    Edit,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    Hash,
} from 'lucide-react'

export const ClientDetails = ({ client }: { client: Clients }) => {
    const router = useRouter()

    const isCompany = client.type === 'company'

    return (
        <AdLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                    isCompany
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        : 'bg-gradient-to-br from-green-500 to-teal-600'
                                }`}
                            >
                                {isCompany ? (
                                    <Building2 className="w-7 h-7 text-white" />
                                ) : (
                                    <User className="w-7 h-7 text-white" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {client.company_name ||
                                        `${client.firstname} ${client.lastname}`}
                                </h1>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                                        isCompany
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}
                                >
                                    {isCompany
                                        ? 'Client professionnel'
                                        : 'Client particulier'}
                                </span>
                            </div>
                        </div>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
                            onClick={() =>
                                router.push(`/clients/${client.id}/edit`)
                            }
                        >
                            <Edit className="w-5 h-5" />
                            Modifier
                        </button>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Informations personnelles
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {isCompany && client.company_name && (
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Société
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {client.company_name}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Nom complet
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {client.firstname} {client.lastname}
                                </p>
                            </div>
                        </div>
                        {client.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${client.email}`}
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        {client.email}
                                    </a>
                                </div>
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Téléphone
                                    </p>
                                    <a
                                        href={`tel:${client.phone}`}
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        {client.phone}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Adresse */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Adresse
                        </h2>
                    </div>

                    <div className="space-y-2">
                        {client.address && (
                            <p className="text-gray-900">{client.address}</p>
                        )}
                        {client.additional_address && (
                            <p className="text-gray-600">
                                {client.additional_address}
                            </p>
                        )}
                        <p className="text-gray-900">
                            {client.zipcode && `${client.zipcode} `}
                            {client.city}
                        </p>
                        {client.country && (
                            <p className="text-gray-900">{client.country}</p>
                        )}
                    </div>
                </div>

                {/* Informations légales (uniquement pour les professionnels) */}
                {isCompany && (client.siret || client.naf_code) && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Informations légales
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {client.siret && (
                                <div className="flex items-start gap-3">
                                    <Hash className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            SIRET
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {client.siret}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {client.naf_code && (
                                <div className="flex items-start gap-3">
                                    <Hash className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Code NAF
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {client.naf_code}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdLayout>
    )
}
