'use client'
import React from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { finalizeAccount } from '@/app/finalizeAccount/action'

const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    company_name: z.string(),
    address: z.string(),
    city: z.string(),
    zipcode: z.string(),
    capital: z.string(),
    siret: z.string(),
})

const FormAccount = ({ userId }: { userId: string }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            company_name: '',
            address: '',
            city: '',
            zipcode: '',
            capital: '',
            siret: '',
        },
    })

    return (
        <>
            <Form {...form}>
                <form action={finalizeAccount} className="space-y-8">
                    <input type="hidden" name="id" value={userId} />
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Prénom"
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
                        name="lastname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nom"
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
                        name="company_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom de la société</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nom de la société"
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
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Adresse"
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
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ville"
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
                        name="zipcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code postal</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Code postal"
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
                        name="capital"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capital social</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Capital social"
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
                        name="siret"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SIRET</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="SIRET"
                                        {...field}
                                        type="text"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Confirmer</Button>
                </form>
            </Form>
        </>
    )
}

export default FormAccount
