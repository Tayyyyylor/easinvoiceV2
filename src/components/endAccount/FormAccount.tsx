'use client'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { finalizeAccount } from '@/app/(app)/finalizeAccount/action'
import { Formfield } from '../atoms/Formfield'
import { uploadLogo } from '@/utils/supabase/storage'
import { useAuth } from '@/contexts/useAuth'
import Image from 'next/image'

const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    company_name: z.string(),
    address: z.string(),
    additional_address: z.string().optional(),
    city: z.string(),
    zipcode: z.string(),
    country: z.string(),
    logo_url: z.string(),
    capital: z.number().optional(),
    siret: z.string(),
})

const FormAccount = () => {
    const { user } = useAuth()
    const [isUploading, setIsUploading] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState('')
    const [uploadError, setUploadError] = React.useState('')
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            company_name: '',
            address: '',
            additional_address: '',
            city: '',
            zipcode: '',
            country: '',
            logo_url: '',
            capital: 0,
            siret: '',
        },
    })

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        // Reset les erreurs précédentes
        setUploadError('')

        try {
            setIsUploading(true)

            // Upload du fichier
            const url = await uploadLogo(file, user.id)

            // Ajouter un timestamp pour forcer le rechargement (cache busting)
            const urlWithTimestamp = `${url}?t=${Date.now()}`

            // Mise à jour du formulaire (on garde l'URL sans timestamp pour la base de données)
            form.setValue('logo_url', url)
            form.clearErrors('logo_url')
            // Mais on utilise l'URL avec timestamp pour l'affichage
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Vérifier que le logo est bien uploadé
        const logoUrl = form.getValues('logo_url')
        // if (!logoUrl) {
        //     form.setError('logo_url', { message: 'Veuillez uploader un logo' })
        //     return
        // }

        // Récupérer le formData du formulaire
        const formData = new FormData(e.currentTarget)

        // Ajouter manuellement le logo_url car c'est un champ caché
        formData.set('logo_url', logoUrl)

        // Appeler l'action serveur
        await finalizeAccount(formData)
    }

    return (
        <main className="mt-10 flex flex-col gap-5 items-center justify-center">
            <h2 className="text-2xl font-bold text-center mb-20">
                Finaliser le profil
            </h2>
            <Form {...form}>
                <form
                    action={finalizeAccount}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    <article className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Logo de l&apos;entreprise
                        </label>
                        {previewUrl && (
                            <section>
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
                                        // Réinitialiser l'input file
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ''
                                        }
                                    }}
                                    disabled={isUploading}
                                >
                                    Changer le logo
                                </Button>
                            </section>
                        )}
                    </article>
                    {!previewUrl && (
                        <section>
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
                            {(uploadError ||
                                form.formState.errors.logo_url) && (
                                <p className="text-sm text-red-600">
                                    {uploadError ||
                                        form.formState.errors.logo_url?.message}
                                </p>
                            )}
                            <input
                                type="hidden"
                                {...form.register('logo_url')}
                            />

                            <p className="text-xs text-gray-500">
                                Formats acceptés : PNG, JPG, WEBP (max 2MB)
                            </p>
                        </section>
                    )}
                    <article className="space-y-4">
                        <section className="flex gap-2">
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
                        </section>
                        <Formfield
                            form={form}
                            name="company_name"
                            label="Nom de la société"
                            placeholder="Nom de la société"
                        />
                    </article>
                    <article className="space-y-4">
                        <section className="flex gap-2">
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
                        </section>
                        <section className="flex gap-2">
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
                        </section>
                    </article>
                    <article className="flex gap-2 items-center">
                        <Formfield
                            form={form}
                            name="capital"
                            label="Capital social"
                            placeholder="Capital social"
                        />
                        <Formfield
                            form={form}
                            name="siret"
                            label="SIRET"
                            placeholder="SIRET"
                        />
                    </article>
                    <Button type="submit" disabled={isUploading}>
                        {isUploading ? 'Upload en cours...' : 'Confirmer'}
                    </Button>
                </form>
            </Form>
        </main>
    )
}

export default FormAccount
