'use client'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Formfield } from '../atoms/Formfield'
import { uploadLogo } from '@/utils/supabase/storage'
import { useAuth } from '@/contexts/useAuth'
import Image from 'next/image'
import { updateProfile } from '@/app/(app)/profile/action'
import { AdLayout } from '../layouts/AdLayout'

const formSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    company_name: z.string().optional(),
    address: z.string().optional(),
    additional_address: z.string().optional(),
    city: z.string().optional(),
    zipcode: z.string().optional(),
    country: z.string().optional(),
    logo_url: z.string().optional(),
    capital: z.number().optional(),
    siret: z.string().optional(),
})

type ProfileFormData = z.infer<typeof formSchema>

interface FormProfileProps {
    initialData?: ProfileFormData
}

export const FormProfile = ({ initialData }: FormProfileProps) => {
    const { user } = useAuth()
    const [isUploading, setIsUploading] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState(
        initialData?.logo_url || ''
    )
    const [uploadError, setUploadError] = React.useState('')
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: initialData?.firstname || '',
            lastname: initialData?.lastname || '',
            company_name: initialData?.company_name || '',
            address: initialData?.address || '',
            additional_address: initialData?.additional_address || '',
            city: initialData?.city || '',
            zipcode: initialData?.zipcode || '',
            country: initialData?.country || '',
            logo_url: initialData?.logo_url || '',
            capital: initialData?.capital || 0,
            siret: initialData?.siret || '',
        },
    })

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setUploadError('')

        try {
            setIsUploading(true)
            const url = await uploadLogo(file, user.id)
            const urlWithTimestamp = `${url}?t=${Date.now()}`

            form.setValue('logo_url', url)
            form.clearErrors('logo_url')
            setPreviewUrl(urlWithTimestamp)
        } catch (error) {
            console.error('Error uploading logo:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'upload"
            setUploadError(errorMessage)
            form.setError('logo_url', { message: errorMessage })
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        // Ajouter le logo_url s'il existe
        const logoUrl = form.getValues('logo_url')
        if (logoUrl) {
            formData.set('logo_url', logoUrl)
        }

        await updateProfile(formData)
    }

    return (
        <AdLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Modifier le profil
                            </h1>
                            <p className="text-gray-600">
                                Mettez à jour vos informations professionnelles
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form action={handleSubmit} className="space-y-6">
                        {/* Section Logo */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Logo de l&apos;entreprise
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Formats acceptés : PNG, JPG, WEBP (max
                                        2MB)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {previewUrl && (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Image
                                                src={previewUrl}
                                                alt="Logo preview"
                                                width={96}
                                                height={96}
                                                className="object-contain rounded-lg border-2 border-gray-200 p-2"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setPreviewUrl('')
                                                form.setValue('logo_url', '')
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value =
                                                        ''
                                                }
                                            }}
                                            disabled={isUploading}
                                        >
                                            Changer le logo
                                        </Button>
                                    </div>
                                )}
                                {!previewUrl && (
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isUploading}
                                        />
                                        {isUploading && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                Upload en cours...
                                            </p>
                                        )}
                                        {(uploadError ||
                                            form.formState.errors.logo_url) && (
                                            <p className="text-sm text-red-600">
                                                {uploadError ||
                                                    form.formState.errors
                                                        .logo_url?.message}
                                            </p>
                                        )}
                                        <input
                                            type="hidden"
                                            {...form.register('logo_url')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section Informations personnelles */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Informations personnelles
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Identité et entreprise
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Formfield
                                        form={form}
                                        name="firstname"
                                        label="Prénom"
                                        placeholder="Prénom"
                                    />
                                    <Formfield
                                        form={form}
                                        name="lastname"
                                        label="Nom"
                                        placeholder="Nom"
                                    />
                                </div>
                                <Formfield
                                    form={form}
                                    name="company_name"
                                    label="Nom de la société"
                                    placeholder="Nom de la société"
                                />
                            </div>
                        </div>

                        {/* Section Adresse */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Adresse
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Localisation de l&apos;entreprise
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Formfield
                                        form={form}
                                        name="address"
                                        label="Adresse"
                                        placeholder="Adresse"
                                    />
                                    <Formfield
                                        form={form}
                                        name="additional_address"
                                        label="Complément d'adresse"
                                        placeholder="Complément d'adresse"
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Formfield
                                        form={form}
                                        name="city"
                                        label="Ville"
                                        placeholder="Ville"
                                    />
                                    <Formfield
                                        form={form}
                                        name="zipcode"
                                        label="Code postal"
                                        placeholder="Code postal"
                                    />
                                    <Formfield
                                        form={form}
                                        name="country"
                                        label="Pays"
                                        placeholder="Pays"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Informations légales */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-amber-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Informations légales
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Capital et SIRET
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Formfield
                                    form={form}
                                    name="capital"
                                    label="Capital social"
                                    placeholder="Capital social"
                                    type="number"
                                />
                                <Formfield
                                    form={form}
                                    name="siret"
                                    label="SIRET"
                                    placeholder="SIRET"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isUploading}
                                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg"
                            >
                                {isUploading
                                    ? 'Upload en cours...'
                                    : '💾 Mettre à jour'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AdLayout>
    )
}
