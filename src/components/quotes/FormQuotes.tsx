'use client'

import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuote, updateQuote } from '@/app/(app)/quotes/action'
import { Formfield } from '../atoms/Formfield'
import { FormClients } from '../clients/FormClients'
import { Select } from '../atoms/Select'
import { ItemsLineForm } from '../atoms/ItemsLineForm'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { AdLayout } from '../layouts/AdLayout'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

const quoteLineSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().positive().optional(),
    unit_price: z.number().nonnegative().optional(), // en € côté form
    total_price: z.number().nonnegative().optional(),
    type: z.string().min(1),
    tax_rate: z.number().nonnegative().optional(),
})

const createQuoteSchema = z.object({
    description: z.string().min(1),
    currency: z.string().min(1),
    validity_days: z.number().nonnegative().optional(),
    terms: z.string().min(1).optional(),
    lines: z.array(quoteLineSchema).min(1),
    client_id: z.number().positive().optional(),
    name: z.string().min(1),
    tva_non_applicable: z.boolean().optional(),
})
type CreateQuoteValues = z.infer<typeof createQuoteSchema>

interface FormQuotesProps {
    clients: Clients[]
    initialData?: { quote: Quotes; items: QuoteItems[] }
}
export const FormQuotes = ({
    clients: initialClients,
    initialData,
}: FormQuotesProps) => {
    const [showNewClientForm, setShowNewClientForm] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const [clients, setClients] = useState(initialClients)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CreateQuoteValues>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {
            terms: initialData?.quote.terms || '',
            lines: initialData?.items.map((item) => ({
                description: item.description,
                type: item.type,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.tax_rate,
            })) || [
                {
                    description: '',
                    type: 'service',
                    quantity: 1,
                    unit_price: 0,
                    tax_rate: 20,
                },
            ],
            currency: 'EUR',
            validity_days: initialData?.quote.validity_days || 1,
            name: initialData?.quote.name || '',
            description: initialData?.quote.description || '',
            client_id: initialData?.quote.client_id || undefined,
            tva_non_applicable: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lines',
    })

    const tvaNonApplicable = form.watch('tva_non_applicable')

    const handleClientCreated = (newClient: Clients) => {
        // Ajouter le nouveau client à la liste
        setClients([...clients, newClient])
        // Sélectionner automatiquement le nouveau client
        setSelectValue(newClient.id.toString())
        form.setValue('client_id', newClient.id)
        // Fermer le dialog
        setShowNewClientForm(false)
    }

    return (
        <AdLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {initialData?.quote.id ? 'Modifier' : 'Créer'}{' '}
                                un devis
                            </h1>
                            <p className="text-gray-600">
                                {initialData?.quote.id
                                    ? 'Modifiez les informations de votre devis'
                                    : 'Remplissez les informations pour générer votre devis'}
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        className="space-y-6"
                        action={async (formData) => {
                            // Empêcher la double soumission
                            if (isSubmitting) return
                            setIsSubmitting(true)

                            try {
                                // Empêcher la soumission si aucun client n'est sélectionné
                                const values = form.getValues()
                                if (!values.client_id) {
                                    form.setError('client_id', {
                                        type: 'required',
                                        message:
                                            'Veuillez sélectionner un client',
                                    })
                                    setIsSubmitting(false)
                                    return
                                }

                                // Remettre le payload (inclut client_id et lines)
                                formData.append(
                                    'payload',
                                    JSON.stringify(values)
                                )

                                // Ajouter l'ID du devis si on est en mode édition
                                if (initialData?.quote.id) {
                                    formData.append(
                                        'quote_id',
                                        initialData.quote.id.toString()
                                    )
                                    await updateQuote(formData)
                                } else {
                                    await createQuote(formData)
                                }
                            } catch (error) {
                                console.error(
                                    'Erreur lors de la soumission:',
                                    error
                                )
                                setIsSubmitting(false)
                            }
                        }}
                    >
                        {/* Section Client */}
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Informations client
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Sélectionnez ou créez un client
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Select
                                    label="Clients"
                                    name="client_id"
                                    value={selectValue}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setSelectValue(value)
                                        if (value === 'new-client') {
                                            setShowNewClientForm(true)
                                            form.setValue(
                                                'client_id',
                                                undefined
                                            )
                                        } else if (value === '') {
                                            setShowNewClientForm(false)
                                            form.setValue(
                                                'client_id',
                                                undefined
                                            )
                                        } else {
                                            setShowNewClientForm(false)
                                            form.setValue(
                                                'client_id',
                                                Number(value)
                                            )
                                        }
                                    }}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Sélectionner un client',
                                        },
                                        {
                                            id: 'new-client',
                                            value: 'new-client',
                                            label: '+ Nouveau client',
                                        },
                                        ...clients.map((client) => ({
                                            id: client.id.toString(),
                                            value: client.id.toString(),
                                            label:
                                                client.firstname ||
                                                client.company_name,
                                        })),
                                    ]}
                                />

                                {form.formState.errors.client_id && (
                                    <p className="text-sm text-red-500">
                                        {
                                            form.formState.errors.client_id
                                                .message
                                        }
                                    </p>
                                )}
                                <input
                                    type="hidden"
                                    name="client_id"
                                    value={(
                                        form.watch('client_id') ?? ''
                                    ).toString()}
                                />
                            </div>
                        </div>

                        <Dialog
                            open={showNewClientForm}
                            onOpenChange={setShowNewClientForm}
                        >
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto text-white">
                                <DialogHeader>
                                    <DialogTitle>
                                        Créer un nouveau client
                                    </DialogTitle>
                                    <DialogDescription>
                                        Remplissez le formulaire ci-dessous pour
                                        créer un nouveau client. Il sera
                                        automatiquement sélectionné pour votre
                                        devis.
                                    </DialogDescription>
                                </DialogHeader>
                                <FormClients
                                    standalone={false}
                                    onSuccess={handleClientCreated}
                                />
                            </DialogContent>
                        </Dialog>

                        {/* Section Informations du devis */}
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
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Détails du devis
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Informations générales
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Formfield
                                        form={form}
                                        name="name"
                                        label="Nom du devis"
                                        placeholder="Ex: Devis 1"
                                    />
                                    <Formfield
                                        form={form}
                                        name="description"
                                        label="Objet du devis"
                                        placeholder="Ex: Site vitrine"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <Formfield
                                        form={form}
                                        name="currency"
                                        label="Devise"
                                        placeholder="EUR"
                                    />
                                    <Formfield
                                        form={form}
                                        name="validity_days"
                                        label="Validité (jours)"
                                        placeholder="30"
                                        type="number"
                                    />
                                    <Formfield
                                        form={form}
                                        name="terms"
                                        label="Notes"
                                        placeholder="Notes (optionnel)"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <Checkbox
                                        id="TVA"
                                        checked={tvaNonApplicable}
                                        onCheckedChange={(checked) => {
                                            form.setValue(
                                                'tva_non_applicable',
                                                checked as boolean
                                            )
                                            fields.forEach((_, index) => {
                                                form.setValue(
                                                    `lines.${index}.tax_rate`,
                                                    checked ? 0 : 20
                                                )
                                            })
                                        }}
                                    />
                                    <Label
                                        htmlFor="TVA"
                                        className="cursor-pointer font-medium"
                                    >
                                        TVA non applicable
                                    </Label>
                                    <input
                                        type="hidden"
                                        name="tva_non_applicable"
                                        value={
                                            tvaNonApplicable ? 'true' : 'false'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Section Articles/Services */}
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Articles & Services
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Ajoutez les lignes de votre devis
                                    </p>
                                </div>
                            </div>

                            <ItemsLineForm
                                fields={fields}
                                form={form}
                                remove={remove}
                                append={append}
                                tvaNonApplicable={tvaNonApplicable}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
                            >
                                {isSubmitting
                                    ? 'En cours...'
                                    : `${initialData?.quote.id ? '💾 Modifier' : '✨ Créer'} le devis`}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AdLayout>
    )
}
