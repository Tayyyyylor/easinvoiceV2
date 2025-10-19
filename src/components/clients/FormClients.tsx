'use client'
import { createAClient } from '@/app/(app)/clients/action'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '../ui/form'
import { z } from 'zod'
import { Formfield } from '../atoms/Formfield'
import { Button } from '../ui/button'

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
    standalone = true,
}: {
    standalone?: boolean
}) => {
    const form = useForm<CreateClientValues>({
        resolver: zodResolver(createClientSchema),
        defaultValues: {
            type: 'individual',
            email: '',
            firstname: '',
            lastname: '',
            company_name: '',
            address: '',
            additional_address: '',
            city: '',
            zipcode: '',
            country: '',
            phone: '',
            siret: '',
            naf_code: '',
        },
    })

    const selectType = [
        {
            value: 'individual',
            label: 'Individuel',
        },
        {
            value: 'company',
            label: 'Société',
        },
    ]

    const clientType = form.watch('type')

    const formContent = (
        <>
            <h2 className="text-2xl font-bold">Créer un client</h2>
            <div>
                <label htmlFor="type">Type de client</label>
                <select
                    name="type"
                    id="type"
                    value={clientType}
                    onChange={(e) => {
                        form.setValue(
                            'type',
                            e.target.value as 'company' | 'individual'
                        )
                    }}
                >
                    {selectType.map((type, index) => (
                        <option value={type.value} key={index}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <input type="hidden" name="type" value={clientType} />
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex gap-5">
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
                <div className="flex gap-5">
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
            {clientType === 'company' && (
                <div className="flex flex-col gap-5">
                    <div className="flex gap-5">
                        <Formfield
                            form={form}
                            name="company_name"
                            label="Nom de la société"
                            placeholder="Nom de la société"
                        />
                    </div>
                    <div className="flex gap-5">
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
            )}
            <div className="flex flex-col gap-5">
                <div className="flex gap-5">
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
                <div className="flex gap-5">
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
                <div className="flex gap-5">
                    <Formfield
                        form={form}
                        name="country"
                        label="Pays"
                        placeholder="Pays"
                    />
                </div>
            </div>

            <Button type="submit">Créer le client</Button>
        </>
    )

    return (
        <Form {...form}>
            {standalone ? (
                <form className="space-y-8" action={createAClient}>
                    {formContent}
                </form>
            ) : (
                <main className="space-y-8">{formContent}</main>
            )}
        </Form>
    )
}
