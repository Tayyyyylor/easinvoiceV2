'use client'
import { login } from '@/app/(auth)/login/actions'
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

const formSchema = z.object({
    email: z.email({
        message: 'Email invalide.',
    }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
})
type LoginValues = z.infer<typeof formSchema>
const Login = () => {
    const isMobile = useMobile()
    const [state, formAction] = useActionState(login, null)

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
                className="w-full bg-mainBlue text-white hover:bg-mainBlueLight"
            >
                {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
        </section>
    )

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <article className="flex flex-col items-center justify-center gap-4 mb-15">
                <Image
                    src="/logo_black.png"
                    alt="Logo"
                    width={300}
                    height={300}
                />
                <h2 className="text-2xl font-bold text-mainBlue">Connexion</h2>
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
                Vous n&apos;avez pas de compte ?
                <Link href="/signup" className="text-blue-500">
                    S&apos;inscrire
                </Link>
            </p>
        </main>
    )
}

export default Login
