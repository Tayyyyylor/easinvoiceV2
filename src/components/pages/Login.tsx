'use client'
import { login } from '@/app/(auth)/login/actions'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Formfield } from '../atoms/Formfield'

const formSchema = z.object({
    email: z.email({
        message: 'Email invalide.',
    }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
})
type LoginValues = z.infer<typeof formSchema>
const Login = () => {
    const form = useForm<LoginValues>({
        mode: 'onChange', // Valider à chaque changement
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const formFields = [
        {
            name: 'email',
            label: 'Email',
            placeholder: 'Email',
        },
        {
            name: 'password',
            label: 'Mot de passe',
            placeholder: 'Mot de passe',
            type: 'password',
        },
    ]
    const formContent = (
        <>
            <h2>Connexion</h2>
            {formFields.map((field) => (
                <Formfield key={field.name} form={form} {...field} />
            ))}
            <Button
                type="submit"
                disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full"
            >
                {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
        </>
    )

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <Form {...form}>
                <form action={login} className="space-y-8">
                    {formContent}
                </form>
            </Form>
            <p className="text-sm text-gray-500 mt-4">
                Vous n&apos;avez pas de compte ?
                <Link href="/signup" className="text-blue-500">
                    S&apos;inscrire
                </Link>
            </p>
        </main>
    )
}

export default Login
