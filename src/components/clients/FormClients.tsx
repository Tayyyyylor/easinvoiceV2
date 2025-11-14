'use client'
import {
    createAClient,
    createAClientAndReturn,
    updateClient,
} from '@/app/(app)/clients/action'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '../ui/form'
import { z } from 'zod'
import { Formfield } from '../atoms/Formfield'
import { Button } from '../ui/button'
import { Select } from '../atoms/Select'
import { AdLayout } from '../layouts/AdLayout'

const createClientSchema = z.object({
    type: z.enum(['company', 'individual']),
    email: z.email().optional(),
    firstname: z.string().min(1).optional(),
    lastname: z.string().min(1).optional(),
    company_name: z.string().min(1).optional(),
    address: z.string().min(1),
    additional_address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    zipcode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    siret: z.string().min(1).optional(),
    naf_code: z.string().min(1).optional(),
})
type CreateClientValues = z.infer<typeof createClientSchema>

export const FormClients = ({
    initialData,
    standalone = true,
    onSuccess,
}: {
    standalone?: boolean
    onSuccess?: (client: Clients) => void
    initialData?: Clients
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const form = useForm<CreateClientValues>({
        resolver: zodResolver(createClientSchema),
        defaultValues: {
            type:
                (initialData?.type as 'company' | 'individual') || 'individual',
            email: initialData?.email || '',
            firstname: initialData?.firstname || '',
            lastname: initialData?.lastname || '',
            company_name: initialData?.company_name || '',
            address: initialData?.address || '',
            additional_address: initialData?.additional_address || '',
            city: initialData?.city || '',
            zipcode: initialData?.zipcode || '',
            country: initialData?.country || '',
            phone: initialData?.phone || '',
            siret: initialData?.siret || '',
            naf_code: initialData?.naf_code || '',
        },
    })

    const selectType = [
        {
            value: 'individual',
            label: 'Particuliers',
        },
        {
            value: 'company',
            label: 'Professionnels',
        },
    ]

    const clientType = form.watch('type')

    const formContent = (
        <div className={standalone ? 'max-w-4xl mx-auto' : ''}>
            {standalone && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-2">
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
                            <h1 className="text-3xl font-bold text-gray-900">
                                {initialData?.id ? 'Modifier' : 'Créer'} un
                                client
                            </h1>
                            <p className="text-gray-600">
                                {initialData?.id
                                    ? 'Modifiez les informations du client'
                                    : 'Ajoutez un nouveau client à votre portefeuille'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Section Type de client */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Type de client
                            </h2>
                            <p className="text-sm text-gray-600">
                                Particulier ou professionnel
                            </p>
                        </div>
                    </div>

                    <Select
                        label="Type de client"
                        name="type"
                        onChange={(e) => {
                            form.setValue(
                                'type',
                                e.target.value as 'company' | 'individual'
                            )
                        }}
                        value={clientType}
                        options={selectType}
                    />
                </div>

                {/* Section Informations personnelles */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Informations personnelles
                            </h2>
                            <p className="text-sm text-gray-600">
                                Identité et contact
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Formfield
                                form={form}
                                name="firstname"
                                label="Prénom"
                                placeholder="Prénom"
                            />
                            <Formfield
                                form={form}
                                name="lastname"
                                label="Nom"
                                placeholder="Nom"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Formfield
                                form={form}
                                name="email"
                                label="Email"
                                placeholder="Email"
                            />
                            <Formfield
                                form={form}
                                name="phone"
                                label="Téléphone"
                                placeholder="Téléphone"
                            />
                        </div>
                    </div>
                </div>

                {/* Section Entreprise (conditionnelle) */}
                {clientType === 'company' && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-indigo-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Informations entreprise
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Données légales
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Formfield
                                form={form}
                                name="company_name"
                                label="Nom de la société"
                                placeholder="Nom de la société"
                            />
                            <div className="grid md:grid-cols-2 gap-4">
                                <Formfield
                                    form={form}
                                    name="siret"
                                    label="Siret"
                                    placeholder="Siret"
                                />
                                <Formfield
                                    form={form}
                                    name="naf_code"
                                    label="Code NAF"
                                    placeholder="Code NAF"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Adresse */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Adresse
                            </h2>
                            <p className="text-sm text-gray-600">
                                Coordonnées géographiques
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Formfield
                                form={form}
                                name="address"
                                label="Adresse"
                                placeholder="Adresse"
                            />
                            <Formfield
                                form={form}
                                name="additional_address"
                                label="Complément d'adresse"
                                placeholder="Complément d'adresse"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Formfield
                                form={form}
                                name="city"
                                label="Ville"
                                placeholder="Ville"
                            />
                            <Formfield
                                form={form}
                                name="zipcode"
                                label="Code postal"
                                placeholder="Code postal"
                            />
                        </div>
                        <Formfield
                            form={form}
                            name="country"
                            label="Pays"
                            placeholder="Pays"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const handleSubmitModal = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)

        const result = await createAClientAndReturn(formData)
        setIsSubmitting(false)

        if (result.success && result.data) {
            form.reset()
            onSuccess?.(result.data)
        } else {
            setError(result.error || 'Une erreur est survenue')
        }
    }

    return (
        <Form {...form}>
            {standalone ? (
                <AdLayout>
                    <form
                        className="space-y-8"
                        action={async (formData) => {
                            // Si on est en mode édition, ajouter le payload et l'ID
                            if (initialData?.id) {
                                const values = form.getValues()
                                formData.append(
                                    'payload',
                                    JSON.stringify(values)
                                )
                                formData.append(
                                    'client_id',
                                    initialData.id.toString()
                                )
                                await updateClient(formData)
                            } else {
                                await createAClient(formData)
                            }
                        }}
                    >
                        {formContent}
                        <div className="flex justify-end gap-4 pt-4 max-w-4xl mx-auto px-4">
                            <Button
                                type="submit"
                                className="px-8 py-6 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                            >
                                {initialData?.id
                                    ? '💾 Modifier le client'
                                    : '✨ Créer le client'}
                            </Button>
                        </div>
                    </form>
                </AdLayout>
            ) : (
                <form className="space-y-8" action={handleSubmitModal}>
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}
                    {formContent}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                        {isSubmitting
                            ? 'Création en cours...'
                            : '✨ Créer le client'}
                    </Button>
                </form>
            )}
        </Form>
    )
}
