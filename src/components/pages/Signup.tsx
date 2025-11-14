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
import {
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react'

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

    const password = form.watch('password')

    // Validation du mot de passe en temps réel
    const passwordValidations = {
        minLength: password?.length >= 8,
        hasUppercase: /[A-Z]/.test(password || ''),
        hasNumber: /[0-9]/.test(password || ''),
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
            {/* Cercles décoratifs en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
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
                        Créez votre compte
                    </h1>
                    <p className="text-gray-600">
                        Commencez à gérer vos factures et devis facilement
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
                                    <Mail className="w-4 h-4 text-purple-600" />
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
                                    <Lock className="w-4 h-4 text-purple-600" />
                                    Mot de passe
                                </label>
                                <Formfield
                                    form={form}
                                    name="password"
                                    label=""
                                    type="password"
                                    placeholder="••••••••"
                                />

                                {/* Indicateurs de validation du mot de passe */}
                                {password && (
                                    <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs font-medium text-gray-700 mb-2">
                                            Votre mot de passe doit contenir :
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs">
                                                <CheckCircle2
                                                    className={`w-4 h-4 ${passwordValidations.minLength ? 'text-green-600' : 'text-gray-400'}`}
                                                />
                                                <span
                                                    className={
                                                        passwordValidations.minLength
                                                            ? 'text-green-700'
                                                            : 'text-gray-600'
                                                    }
                                                >
                                                    Au moins 8 caractères
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <CheckCircle2
                                                    className={`w-4 h-4 ${passwordValidations.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}
                                                />
                                                <span
                                                    className={
                                                        passwordValidations.hasUppercase
                                                            ? 'text-green-700'
                                                            : 'text-gray-600'
                                                    }
                                                >
                                                    Une majuscule
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <CheckCircle2
                                                    className={`w-4 h-4 ${passwordValidations.hasNumber ? 'text-green-600' : 'text-gray-400'}`}
                                                />
                                                <span
                                                    className={
                                                        passwordValidations.hasNumber
                                                            ? 'text-green-700'
                                                            : 'text-gray-600'
                                                    }
                                                >
                                                    Un chiffre
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Champ Confirmation mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                                    Confirmer le mot de passe
                                </label>
                                <Formfield
                                    form={form}
                                    name="confirm_password"
                                    label=""
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Bouton d'inscription */}
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Inscription...
                                    </>
                                ) : (
                                    <>
                                        S&apos;inscrire
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            {/* Conditions */}
                            <p className="text-xs text-gray-500 text-center leading-relaxed">
                                En vous inscrivant, vous acceptez nos{' '}
                                <Link
                                    href="/terms"
                                    className="text-purple-600 hover:text-purple-700 hover:underline"
                                >
                                    Conditions d&apos;utilisation
                                </Link>{' '}
                                et notre{' '}
                                <Link
                                    href="/privacy"
                                    className="text-purple-600 hover:text-purple-700 hover:underline"
                                >
                                    Politique de confidentialité
                                </Link>
                                .
                            </p>
                        </form>
                    </Form>
                </div>

                {/* Lien connexion */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <Link
                            href="/login"
                            className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Signup
