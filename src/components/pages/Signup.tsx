'use client'
import { signup } from '@/app/login/actions'
import React from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Link from 'next/link'

const formSchema = z
    .object({
        email: z.email({
            message: 'Email invalide.',
        }),
        password: z.string().min(8, {
            message: 'Mot de passe trop court.',
        }),
        confirm_password: z.string().min(8, {
            message: 'Mot de passe trop court.',
        }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Les mots de passe ne correspondent pas.',
        path: ['confirm_password'],
    })

type SignupValues = z.infer<typeof formSchema>

const Signup = () => {
    const form = useForm<SignupValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            confirm_password: '',
        },
        mode: 'onTouched',
    })

    return (
        <>
            <Form {...form}>
                <form
                    action={signup}
                    onSubmit={async (e) => {
                        const ok = await form.trigger()
                        if (!ok) {
                            e.preventDefault() // bloque l'envoi => FormMessage affiche les erreurs
                        }
                    }}
                    className="space-y-8"
                >
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
                                <FormMessage />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Confirmer le mot de passe"
                                        {...field}
                                        type="password"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">S&apos;inscrire</Button>
                </form>
            </Form>
            <p>
                Vous avez déjà un compte ?{' '}
                <Link href="/login">Se connecter</Link>
            </p>
        </>
    )
}

export default Signup
