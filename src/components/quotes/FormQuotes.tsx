'use client'

import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuote } from '@/app/(app)/quotes/action'
import { Formfield } from '../atoms/Formfield'
import { FormClients } from '../clients/FormClients'

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
})
type CreateQuoteValues = z.infer<typeof createQuoteSchema>

export const FormQuotes = ({ clients }: { clients: Clients[] }) => {
    const [showNewClientForm, setShowNewClientForm] = useState(false)
    const [selectValue, setSelectValue] = useState('')

    const form = useForm<CreateQuoteValues>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {
            terms: '',
            lines: [],
            currency: 'EUR',
            validity_days: 1,
            name: '',
            description: '',
            client_id: undefined,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lines',
    })

    return (
        <main className="mt-10 flex flex-col gap-5 items-center justify-center">
            <h1>Créer un devis</h1>

            <Form {...form}>
                <form
                    className="space-y-8 w-full max-w-4xl"
                    action={async (formData) => {
                        // Empêcher la soumission si aucun client n'est sélectionné
                        const values = form.getValues()

                        // Remettre le payload (inclut client_id et lines)
                        formData.append('payload', JSON.stringify(values))
                        await createQuote(formData)
                    }}
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="client_id"
                            className="text-sm font-medium"
                        >
                            Clients
                        </label>
                        <select
                            name="client_id"
                            id="client_id"
                            className="w-full p-2 border rounded"
                            value={selectValue}
                            onChange={(e) => {
                                const value = e.target.value
                                setSelectValue(value)
                                if (value === 'new-client') {
                                    setShowNewClientForm(true)
                                    form.setValue('client_id', undefined)
                                } else if (value === '') {
                                    setShowNewClientForm(false)
                                    form.setValue('client_id', undefined)
                                } else {
                                    setShowNewClientForm(false)
                                    form.setValue('client_id', Number(value))
                                }
                            }}
                        >
                            <option value="">Sélectionner un client</option>
                            <option value="new-client">Nouveau client</option>
                            {clients.map((client) => (
                                <option
                                    value={client.id.toString()}
                                    key={client.id}
                                >
                                    {client.firstname || client.company_name}
                                </option>
                            ))}
                        </select>
                        {form.formState.errors.client_id && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.client_id.message}
                            </p>
                        )}
                        <input
                            type="hidden"
                            name="client_id"
                            value={(form.watch('client_id') ?? '').toString()}
                        />
                    </div>

                    {showNewClientForm && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <FormClients standalone={false} />
                        </div>
                    )}
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
                    <div className="grid grid-cols-3 gap-4">
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
                    <div className="space-y-3 ">
                        <div className="text-sm font-medium">Lignes</div>
                        {fields.map((f, i) => (
                            <div
                                key={f.id}
                                className="grid grid-cols-12 gap-2 items-end border rounded p-3"
                            >
                                <div className="col-span-4">
                                    <Formfield
                                        form={form}
                                        name={`lines.${i}.description`}
                                        label="Description"
                                        placeholder="Ex: Intégration"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor={`lines.${i}.type`}
                                        className="text-sm font-medium"
                                    >
                                        Type
                                    </label>
                                    <select
                                        id={`lines.${i}.type`}
                                        className="w-full p-2 border rounded"
                                        value={form.watch(`lines.${i}.type`)}
                                        onChange={(e) => {
                                            form.setValue(
                                                `lines.${i}.type`,
                                                e.target.value
                                            )
                                        }}
                                    >
                                        <option value="service">Service</option>
                                        <option value="produit">Produit</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <Formfield
                                        form={form}
                                        name={`lines.${i}.quantity`}
                                        label="Qté"
                                        placeholder="1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Formfield
                                        form={form}
                                        name={`lines.${i}.unit_price`}
                                        label="Prix unitaire (€)"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Formfield
                                        form={form}
                                        name={`lines.${i}.tax_rate`}
                                        label="TVA %"
                                        placeholder="20"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => remove(i)}
                                    >
                                        −
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                append({
                                    description: '',
                                    type: 'service',
                                    quantity: 1,
                                    unit_price: 0,
                                    tax_rate: 20,
                                })
                            }
                        >
                            + Ajouter une ligne
                        </Button>
                    </div>

                    <Button type="submit">Créer le devis</Button>
                </form>
            </Form>
        </main>
    )
}
