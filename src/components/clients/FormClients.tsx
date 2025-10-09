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
    tva: z.string().optional(),
    naf_code: z.string().min(1).optional(),
})
type CreateClientValues = z.infer<typeof createClientSchema>

export const FormClients = () => {
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
            tva: '0',
            naf_code: '',
        },
    })
    return (
        <Form {...form}>
            <form className="space-y-8" action={createAClient}>
                <h2>Créer un client</h2>
                <Formfield
                    form={form}
                    name="type"
                    label="Type"
                    placeholder="Type"
                />
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
                <Formfield
                    form={form}
                    name="company_name"
                    label="Nom de la société"
                    placeholder="Nom de la société"
                />
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
                <Formfield
                    form={form}
                    name="siret"
                    label="Siret"
                    placeholder="Siret"
                />
                <Formfield
                    form={form}
                    name="tva"
                    label="TVA"
                    placeholder="TVA"
                />
                <Formfield
                    form={form}
                    name="naf_code"
                    label="Code NAF"
                    placeholder="Code NAF"
                />
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
                <Formfield
                    form={form}
                    name="country"
                    label="Pays"
                    placeholder="Pays"
                />
                <Button type="submit">Créer le client</Button>
            </form>
        </Form>
    )
}
