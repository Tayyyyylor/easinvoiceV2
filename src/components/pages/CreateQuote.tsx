'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createQuote } from '@/app/(app)/quotes/action'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select'

const quoteLineSchema = z.object({
    label: z.string().min(1),
    unit: z.string().default('u').optional(),
    quantity: z.number().positive().optional(),
    unit_price: z.number().nonnegative().optional(), // en € côté form
})

const createQuoteSchema = z.object({
    client_name: z.string().min(1),
    buyer: z.object({
        client_address: z.string().min(1),
        client_city: z.string().min(1),
        client_zipcode: z.string().min(1),
        client_capital: z.string().min(1).optional(),
        client_siret: z.string().min(1).optional(),
    }),
    lines: z.array(quoteLineSchema).min(1),
    notes: z.string().optional(),
    terms: z.string().optional(),
})
type CreateQuoteValues = z.infer<typeof createQuoteSchema>

export const CreateQuote = () => {
    const form = useForm<CreateQuoteValues>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {
            client_name: '',
            buyer: {
                client_address: '',
                client_city: '',
                client_zipcode: '',
                client_capital: '',
                client_siret: '',
            },
            lines: [],
            notes: '',
            terms: '',
        },
    })

    // const personalData = [
    //     { label: 'Prénom', value: profile?.firstname },
    //     { label: 'Nom', value: profile?.lastname },
    //     { label: "Nom de l'entreprise", value: profile?.company_name },
    //     { label: 'Adresse', value: profile?.address },
    //     { label: 'Ville', value: profile?.city },
    //     { label: 'Code postal', value: profile?.zipcode },
    //     { label: 'Capital social', value: profile?.capital },
    //     { label: 'Siret/Siren', value: profile?.siret },
    // ]
    return (
        <main className="mt-10">
            <h1>Créer un devis</h1>
            {/* <div>
                <h2>Vos infos</h2>
                {personalData.map((item, index) => (
                    <div className="flex gap-2" key={index}>
                        <label htmlFor="">{item.label}</label>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div> */}
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
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Clients</SelectLabel>
                            {/* {profile.clients.map((client) => (
            <SelectItem value={client.id} key={client.id}>{client.name}</SelectItem>
            ))} */}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div></div>

            <Form {...form}>
                <form className="space-y-8" action={createQuote}>
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
                        name="buyer.client_address"
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
                        name="buyer.client_city"
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
                        name="buyer.client_zipcode"
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
                        name="buyer.client_capital"
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
                    <FormField
                        control={form.control}
                        name="buyer.client_siret"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Siret du client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Siret du client"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Créer le devis</Button>
                </form>
            </Form>
        </main>
    )
}
