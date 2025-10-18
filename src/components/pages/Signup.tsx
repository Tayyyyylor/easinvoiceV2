'use client'
import { signup } from '@/app/(auth)/login/actions'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Formfield } from '../atoms/Formfield'

const formSchema = z
    .object({
        email: z.email({
            message: 'Email invalide.',
        }),
        password: z
            .string()
            .min(8, {
                message: 'Le mot de passe doit contenir au moins 8 caractères',
            })
            .regex(/[A-Z]/, {
                message: 'Le mot de passe doit contenir au moins une majuscule',
            })
            .regex(/[0-9]/, {
                message: 'Le mot de passe doit contenir au moins un chiffre',
            }),
        confirm_password: z.string().min(8, {
            message: 'Le mot de passe doit contenir au moins 8 caractères',
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
        mode: 'onChange',
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
        {
            name: 'confirm_password',
            label: 'Confirmer le mot de passe',
            placeholder: 'Confirmer le mot de passe',
            type: 'password',
        },
    ]
    const formContent = (
        <>
            <h2>Inscription</h2>
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
                {form.formState.isSubmitting ? 'Inscription...' : "S'inscrire"}
            </Button>
        </>
    )

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <Form {...form}>
                <form
                    className="space-y-8"
                    action={async (formData: FormData) => {
                        const result = await signup(formData)
                        if (result?.error) {
                            form.setError('email', { message: result.error })
                            return
                        }
                    }}
                >
                    {formContent}
                </form>
            </Form>
            <p className="text-sm text-gray-500 mt-4">
                Vous avez déjà un compte ?
                <Link href="/login" className="text-blue-500">
                    Se connecter
                </Link>
            </p>
        </main>
    )
}

export default Signup
