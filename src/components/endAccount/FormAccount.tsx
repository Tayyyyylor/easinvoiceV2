'use client'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { finalizeAccount } from '@/app/(app)/finalizeAccount/action'
import { Formfield } from '../atoms/Formfield'

const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    company_name: z.string(),
    address: z.string(),
    additional_address: z.string().optional(),
    city: z.string(),
    zipcode: z.string(),
    country: z.string(),
    capital: z.number().optional(),
    siret: z.string(),
})

const FormAccount = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            company_name: '',
            address: '',
            additional_address: '',
            city: '',
            zipcode: '',
            country: '',
            capital: 0,
            siret: '',
        },
    })

    return (
        <>
            <Form {...form}>
                <form action={finalizeAccount} className="space-y-8">
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
                    <Formfield
                        form={form}
                        name="capital"
                        label="Capital social"
                        placeholder="Capital social"
                        type="number"
                    />
                    <Formfield
                        form={form}
                        name="siret"
                        label="SIRET"
                        placeholder="SIRET"
                    />
                    <Button type="submit">Confirmer</Button>
                </form>
            </Form>
        </>
    )
}

export default FormAccount
