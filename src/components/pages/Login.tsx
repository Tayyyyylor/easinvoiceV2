'use client'
import { login } from '@/app/(auth)/login/actions'
import React from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Link from 'next/link'

const formSchema = z.object({
    email: z.email({
        message: 'Email invalide.',
    }),
    password: z.string(),
})
type LoginValues = z.infer<typeof formSchema>
const Login = () => {
    const form = useForm<LoginValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <Form {...form}>
                <form action={login} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email"
                                        {...field}
                                        type="email"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Mot de passe"
                                        {...field}
                                        type="password"
                                        required
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Se connecter</Button>
                </form>
            </Form>
            <p>
                Vous n&apos;avez pas de compte ?
                <Link href="/signup">S&apos;inscrire</Link>
            </p>
        </main>
    )
}

export default Login
