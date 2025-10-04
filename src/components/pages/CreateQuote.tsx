/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuote } from '@/app/(app)/quotes/action'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select'
import { Formfield } from '../atoms/Formfield'

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
    validity_period: z.number().nonnegative().optional(),
    terms: z.string().min(1).optional(),
    lines: z.array(quoteLineSchema).min(1),
})
type CreateQuoteValues = z.infer<typeof createQuoteSchema>

export const CreateQuote = ({ clients }: { clients: any[] }) => {
    const form = useForm<CreateQuoteValues>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {
            terms: '',
            lines: [],
            currency: 'EUR',
            validity_period: 1,
            description: '',
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lines',
    })

    return (
        <main className="mt-10">
            <h1>Créer un devis</h1>
            <div className="mb-[400px]">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="new-client">
                                Nouveau client
                            </SelectItem>
                            {clients.map((client) => (
                                <SelectItem value={client.id} key={client.id}>
                                    {client.firstname ||
                                        client.company_name}{' '}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div></div>

            <Form {...form}>
                <form className="space-y-8" action={createQuote}>
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
                            name="validity_period"
                            label="Validité (jours)"
                            placeholder="30"
                        />
                        <Formfield
                            form={form}
                            name="terms"
                            label="Notes"
                            placeholder="Notes (optionnel)"
                        />
                    </div>
                    <div className="space-y-3">
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
                                    <Formfield
                                        form={form}
                                        name={`lines.${i}.type`}
                                        label="Type"
                                        placeholder="service/produit"
                                    />
                                </div>
                                <div className="col-span-2">
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
                                        label="PU (€)"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-1">
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
