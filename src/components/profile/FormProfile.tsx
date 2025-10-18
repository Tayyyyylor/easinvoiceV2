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

    const formFields = [
        {
            name: 'firstname',
            label: 'Prénom',
            placeholder: 'Prénom',
        },
        {
            name: 'lastname',
            label: 'Nom',
            placeholder: 'Nom',
        },
        {
            name: 'company_name',
            label: 'Nom de la société',
            placeholder: 'Nom de la société',
        },
        {
            name: 'address',
            label: 'Adresse',
            placeholder: 'Adresse',
        },
        {
            name: 'additional_address',
            label: "Complément d'adresse",
            placeholder: "Complément d'adresse",
        },
        {
            name: 'city',
            label: 'Ville',
            placeholder: 'Ville',
        },
        {
            name: 'zipcode',
            label: 'Code postal',
            placeholder: 'Code postal',
        },
        {
            name: 'country',
            label: 'Pays',
            placeholder: 'Pays',
        },
        {
            name: 'capital',
            label: 'Capital social',
            placeholder: 'Capital social',
            type: 'number',
        },
        {
            name: 'siret',
            label: 'SIRET',
            placeholder: 'SIRET',
        },
    ]

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
        <Form {...form}>
            <form action={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Logo de l&apos;entreprise
                    </label>
                    {previewUrl && (
                        <div>
                            <div className="mt-2">
                                <Image
                                    src={previewUrl}
                                    alt="Logo preview"
                                    width={96}
                                    height={96}
                                    className="object-contain"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setPreviewUrl('')
                                    form.setValue('logo_url', '')
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = ''
                                    }
                                }}
                                disabled={isUploading}
                            >
                                Changer le logo
                            </Button>
                        </div>
                    )}
                </div>
                {!previewUrl && (
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <p className="mt-2 text-sm text-gray-500">
                                Upload en cours...
                            </p>
                        )}
                        {(uploadError || form.formState.errors.logo_url) && (
                            <p className="text-sm text-red-600">
                                {uploadError ||
                                    form.formState.errors.logo_url?.message}
                            </p>
                        )}
                        <input type="hidden" {...form.register('logo_url')} />
                        <p className="text-xs text-gray-500">
                            Formats acceptés : PNG, JPG, WEBP (max 2MB)
                        </p>
                    </div>
                )}

                {formFields.map((field) => (
                    <Formfield key={field.name} form={form} {...field} />
                ))}
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Upload en cours...' : 'Mettre à jour'}
                </Button>
            </form>
        </Form>
    )
}
