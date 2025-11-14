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
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

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

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            {/* Cercles décoratifs en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div
                className={`relative z-10 w-full ${isMobile ? 'max-w-md' : 'max-w-md'}`}
            >
                {/* Logo et titre */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo_black.png"
                            alt="Logo"
                            width={180}
                            height={60}
                            className=" w-auto"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bon retour !
                    </h1>
                    <p className="text-gray-600">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                {/* Carte du formulaire */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Message d'erreur */}
                    {state?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-800">
                                {state.error}
                            </span>
                        </div>
                    )}

                    <Form {...form}>
                        <form action={formAction} className="space-y-5">
                            {/* Champ Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email
                                </label>
                                <Formfield
                                    form={form}
                                    name="email"
                                    label=""
                                    placeholder="votre@email.com"
                                />
                            </div>

                            {/* Champ Mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    Mot de passe
                                </label>
                                <Formfield
                                    form={form}
                                    name="password"
                                    label=""
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Bouton de connexion */}
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Connexion...
                                    </>
                                ) : (
                                    <>
                                        Se connecter
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Lien mot de passe oublié */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>
                </div>

                {/* Lien inscription */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Vous n&apos;avez pas de compte ?{' '}
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                            S&apos;inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login
