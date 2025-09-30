'use client'

import { User } from '@supabase/supabase-js'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
    client_name: z.string(),
    client_address: z.string(),
    client_city: z.string(),
    client_zipcode: z.string(),
    client_capital: z.string(),
    client_siret: z.string(),
})
type CreateQuoteValues = z.infer<typeof formSchema>

export const CreateQuote = ({
    user,
    profile,
}: {
    user: User
    profile: Profile
}) => {
    console.log(user, profile)

    const form = useForm<CreateQuoteValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_name: '',
            client_address: '',
            client_city: '',
            client_zipcode: '',
            client_capital: '',
            client_siret: '',
        },
    })

    const personalData = [
        { label: 'Prénom', value: profile?.firstname },
        { label: 'Nom', value: profile?.lastname },
        { label: "Nom de l'entreprise", value: profile?.company_name },
        { label: 'Adresse', value: profile?.address },
        { label: 'Ville', value: profile?.city },
        { label: 'Code postal', value: profile?.zipcode },
        { label: 'Capital social', value: profile?.capital },
        { label: 'Siret/Siren', value: profile?.siret },
    ]
    return (
        <>
            <h1>Créer un devis</h1>
            <div>
                <h2>Vos infos</h2>
                {personalData.map((item, index) => (
                    <div className="flex gap-2" key={index}>
                        <label htmlFor="">{item.label}</label>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div>

            <Form {...form}>
                <form className="space-y-8">
                    <div>
                        <h2>Informations du client (obligatoire)</h2>
                        <FormField
                            control={form.control}
                            name="client_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du client</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nom du client"
                                            {...field}
                                            type="text"
                                            required
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="client_address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse du client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Adresse du client"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="client_city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ville du client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ville du client"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="client_zipcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code postal du client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Code postal du client"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="client_capital"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capital social du client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Capital social du client"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Se connecter</Button>
                </form>
            </Form>
        </>
    )
}
