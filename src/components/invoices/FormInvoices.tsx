'use client'
import React, { useState } from 'react'
import { Form } from '../ui/form'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Formfield } from '../atoms/Formfield'
import { Button } from '../ui/button'
import { createInvoice } from '@/app/(app)/invoices/action'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { FormClients } from '../clients/FormClients'

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
    name: z.string().min(1),
    payment_date: z.string().optional(),
    payment_method: z.string().optional(),
    interest_rate: z.number().nonnegative().optional(),
    tva_non_applicable: z.boolean().optional(),
})

type CreateInvoiceValues = z.infer<typeof createInvoiceSchema>

export const FormInvoices = ({ clients }: { clients: Clients[] }) => {
    const [showNewClientForm, setShowNewClientForm] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const form = useForm<CreateInvoiceValues>({
        resolver: zodResolver(createInvoiceSchema),
        defaultValues: {
            terms: '',
            lines: [],
            currency: 'EUR',
            name: '',
            description: '',
            client_id: undefined,
            payment_date: '30 jours fin de mois',
            payment_method: 'Virement bancaire',
            interest_rate: 0,
            tva_non_applicable: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lines',
    })

    const tvaNonApplicable = form.watch('tva_non_applicable')

    return (
        <main className="mt-10 flex flex-col gap-5 items-center justify-center">
            <h1>Créer une facture</h1>

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
                        await createInvoice(formData)
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
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="TVA"
                                checked={tvaNonApplicable}
                                onCheckedChange={(checked) => {
                                    form.setValue(
                                        'tva_non_applicable',
                                        checked as boolean
                                    )
                                    // Si la checkbox est cochée, mettre toutes les TVA à 0
                                    if (checked) {
                                        fields.forEach((_, index) => {
                                            form.setValue(
                                                `lines.${index}.tax_rate`,
                                                0
                                            )
                                        })
                                    }
                                }}
                            />
                            <Label htmlFor="TVA">TVA non applicable</Label>
                            <input
                                type="hidden"
                                name="tva_non_applicable"
                                value={tvaNonApplicable ? 'true' : 'false'}
                            />
                        </div>
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
                                        disabled={tvaNonApplicable}
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
                                    tax_rate: tvaNonApplicable ? 0 : 20,
                                })
                            }
                        >
                            + Ajouter une ligne
                        </Button>
                    </div>
                    <div>
                        <h3>Règlement</h3>
                        <Formfield
                            form={form}
                            name="payment_date"
                            label="Date de règlement"
                            placeholder="Date de règlement"
                        />
                        <Formfield
                            form={form}
                            name="payment_method"
                            label="Méthode de règlement"
                            placeholder="Chèque, Virement, etc."
                        />
                        <Formfield
                            form={form}
                            name="interest_rate"
                            label="Intérêts de retard"
                            placeholder="Intérêts de retard"
                        />
                    </div>
                    <Button type="submit">Créer la facture</Button>
                </form>
            </Form>
        </main>
    )
}
