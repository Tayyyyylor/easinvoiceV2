'use client'
import { signup } from '@/app/(auth)/login/actions'
import React, { useActionState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Formfield } from '../atoms/Formfield'
import Image from 'next/image'
import useMobile from '@/hooks/useMobile'

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
    const isMobile = useMobile()
    const [state, formAction] = useActionState(signup, null)

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
        <section className="flex flex-col gap-4 border p-10 rounded-lg w-full">
            {state?.error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span className="block sm:inline">{state.error}</span>
                </div>
            )}
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
            <p className="text-sm text-gray-500 mt-4">
                En vous inscrivant, vous acceptez les{' '}
                <Link href="/terms" className="text-blue-500">
                    Conditions d&apos;utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-blue-500">
                    Politique de confidentialité
                </Link>
                .
            </p>
        </section>
    )

    return (
        <main className="flex flex-col items-center justify-center h-screen w-full">
            <article className="flex flex-col items-center justify-center gap-4 mb-15">
                <Image
                    src="/logo_black.png"
                    alt="Logo"
                    width={300}
                    height={300}
                />
                <h2 className="text-2xl font-bold">Inscription</h2>
            </article>
            <Form {...form}>
                <form
                    action={formAction}
                    className={`space-y-8 ${isMobile ? 'w-[90%]' : 'w-[500px]'}`}
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
