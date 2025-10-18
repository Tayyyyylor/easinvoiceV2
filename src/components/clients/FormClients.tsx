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
            tva: '0',
            naf_code: '',
        },
    })
    const formFields = [
        {
            name: 'type',
            label: 'Type',
            placeholder: 'Type',
        },
        {
            name: 'firstname',
            label: 'Prénom',
            placeholder: 'Prénom',
        },
        {
            name: 'lastname',
            label: 'Nom',
            placeholder: 'Nom',
        },
        {
            name: 'company_name',
            label: 'Nom de la société',
            placeholder: 'Nom de la société',
        },
        {
            name: 'email',
            label: 'Email',
            placeholder: 'Email',
        },
        {
            name: 'phone',
            label: 'Téléphone',
            placeholder: 'Téléphone',
        },
        {
            name: 'siret',
            label: 'Siret',
            placeholder: 'Siret',
        },
        {
            name: 'tva',
            label: 'TVA',
            placeholder: 'TVA',
        },
        {
            name: 'naf_code',
            label: 'Code NAF',
            placeholder: 'Code NAF',
        },
        {
            name: 'address',
            label: 'Adresse',
            placeholder: 'Adresse',
        },
        {
            name: 'additional_address',
            label: "Complément d'adresse",
            placeholder: "Complément d'adresse",
        },
        {
            name: 'city',
            label: 'Ville',
            placeholder: 'Ville',
        },
        {
            name: 'zipcode',
            label: 'Code postal',
            placeholder: 'Code postal',
        },
        {
            name: 'country',
            label: 'Pays',
            placeholder: 'Pays',
        },
    ]

    const formContent = (
        <>
            <h2>Créer un client</h2>
            {formFields.map((field) => (
                <Formfield key={field.name} form={form} {...field} />
            ))}
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
                <div className="space-y-8">{formContent}</div>
            )}
        </Form>
    )
}
