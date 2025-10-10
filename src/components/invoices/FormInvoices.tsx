/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { Form } from '../ui/form';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Formfield } from '../atoms/Formfield';
import { Button } from '../ui/button';
import { createInvoice } from '@/app/(app)/invoices/action';

const invoiceLineSchema = z.object({
    description: z.string().min(1),
    quantity: z.number().positive().optional(),
    unit_price: z.number().nonnegative().optional(), // en € côté form
    total_price: z.number().nonnegative().optional(),
    type: z.string().min(1),
    tax_rate: z.number().nonnegative().optional(),
})

const createInvoiceSchema = z.object({
    description: z.string().min(1),
    currency: z.string().min(1),
    terms: z.string().min(1).optional(),
    lines: z.array(invoiceLineSchema).min(1),
    client_id: z.number().positive().optional(),
    name: z.string().min(1)
})

type CreateInvoiceValues = z.infer<typeof createInvoiceSchema>

export const FormInvoices = ({ clients }: { clients: any[] }) => {
    console.log('clients :>> ', clients);

    const form = useForm<CreateInvoiceValues>({
            resolver: zodResolver(createInvoiceSchema),
            defaultValues: {
                terms: '',
                lines: [],
                currency: 'EUR',
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
      <main className="mt-10">
            <h1>Créer une facture</h1>

            <Form {...form}>
                <form
                    className="space-y-8"
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
                        await createInvoice(formData)
                    }}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Clients</label>
                        <Select
                            value={form.watch('client_id')?.toString()}
                            onValueChange={(value) => {
                                form.setValue(
                                    'client_id',
                                    value === 'new-client'
                                        ? undefined
                                        : Number(value)
                                )
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="new-client">
                                        Nouveau client
                                    </SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem
                                            value={client.id.toString()}
                                            key={client.id}
                                        >
                                            {client.firstname ||
                                                client.company_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                    <Formfield
                        form={form}
                        name="name"
                        label="Nom de la facture"
                        placeholder="Ex: Facture 1"
                    />
                    <Formfield
                        form={form}
                        name="description"
                        label="Objet de la facture"
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
