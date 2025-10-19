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
import { Select } from '../atoms/Select'
import { ItemsLineForm } from '../atoms/ItemsLineForm'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
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

export const FormQuotes = ({
    clients: initialClients,
}: {
    clients: Clients[]
}) => {
    const [showNewClientForm, setShowNewClientForm] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const [clients, setClients] = useState(initialClients)

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
        <main className="mt-10 flex flex-col gap-5 items-center justify-center">
            <h2 className="text-2xl font-bold text-center mb-20">
                Créer un devis
            </h2>
            <Form {...form}>
                <form
                    className="space-y-8 w-full max-w-4xl"
                    action={async (formData) => {
                        // Empêcher la soumission si aucun client n'est sélectionné
                        const values = form.getValues()
                        if (!values.client_id) {
                            form.setError('client_id', {
                                type: 'required',
                                message: 'Veuillez sélectionner un client',
                            })
                            return
                        }

                        // Remettre le payload (inclut client_id et lines)
                        formData.append('payload', JSON.stringify(values))
                        await createQuote(formData)
                    }}
                >
                    <article className="space-y-2">
                        <Select
                            label="Clients"
                            name="client_id"
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
                            options={[
                                { value: '', label: 'Sélectionner un client' },
                                {
                                    id: 'new-client',
                                    value: 'new-client',
                                    label: 'Nouveau client',
                                },
                                ...clients.map((client) => ({
                                    id: client.id.toString(),
                                    value: client.id.toString(),
                                    label:
                                        client.firstname || client.company_name,
                                })),
                            ]}
                        />

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
                    </article>

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
                    <article className="grid grid-cols-3 gap-4">
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
                        <section className="flex items-center gap-2">
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
                            <Label htmlFor="TVA">TVA non applicable</Label>
                            <input
                                type="hidden"
                                name="tva_non_applicable"
                                value={tvaNonApplicable ? 'true' : 'false'}
                            />
                        </section>
                    </article>
                    <ItemsLineForm
                        fields={fields}
                        form={form}
                        remove={remove}
                        append={append}
                        tvaNonApplicable={tvaNonApplicable}
                    />
                    <Button type="submit">Créer le devis</Button>
                </form>
            </Form>
        </main>
    )
}
