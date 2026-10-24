'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Download, Upload, HardDrive, Building2, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/useAuth'
import { AdLayout } from '@/components/layouts/AdLayout'

export const Settings = ({ recovery = false }: { recovery?: boolean }) => {
    const { profile } = useAuth()
    const router = useRouter()
    const fileInput = useRef<HTMLInputElement>(null)
    const [backup, setBackup] = useState<{
        name: string
        content: string
    } | null>(null)
    const [restoring, setRestoring] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function selectBackup(event: ChangeEvent<HTMLInputElement>) {
        setError('')
        setSuccess('')
        setBackup(null)
        const file = event.target.files?.[0]
        if (!file) return
        try {
            const content = await file.text()
            JSON.parse(content)
            setBackup({ name: file.name, content })
        } catch (cause) {
            setError(
                cause instanceof SyntaxError
                    ? 'Ce fichier ne contient pas un JSON valide.'
                    : cause instanceof Error
                      ? cause.message
                      : 'Impossible de lire ce fichier.'
            )
            event.target.value = ''
        }
    }

    async function restoreBackup() {
        if (!backup || restoring) return
        setRestoring(true)
        setError('')
        setSuccess('')
        try {
            const response = await fetch('/api/backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: backup.content,
            })
            const result = await response.json().catch(() => null)
            if (!response.ok)
                throw new Error(result?.error || 'La restauration a échoué.')
            setBackup(null)
            if (fileInput.current) fileInput.current.value = ''
            setSuccess('Sauvegarde restaurée. Vos données sont à jour.')
            if (recovery) router.replace('/dashboard')
            else router.refresh()
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : 'La restauration a échoué.'
            )
        } finally {
            setRestoring(false)
        }
    }

    return (
        <AdLayout>
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {recovery ? 'Restaurer mes données' : 'Paramètres'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Votre espace personnel sur cet ordinateur.
                    </p>
                </div>

                {recovery && (
                    <div
                        role="alert"
                        className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900"
                    >
                        <p className="font-semibold">
                            Impossible de lire les données locales.
                        </p>
                        <p>
                            Le fichier existant a été conservé. Restaurez une
                            sauvegarde JSON ci-dessous pour retrouver votre
                            espace. Une copie du fichier actuel sera conservée
                            avant son remplacement.
                        </p>
                    </div>
                )}

                <section className="space-y-4 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
                        <HardDrive className="h-6 w-6 text-green-600" />
                        Enregistrement local
                    </h2>
                    <p className="text-gray-700">
                        Vos clients, devis, factures et coordonnées sont
                        enregistrés automatiquement dans un fichier sur cet
                        ordinateur. Vous les retrouvez après avoir fermé le
                        navigateur ou redémarré l’application.
                    </p>
                    <p className="text-sm text-gray-600">
                        Par défaut, ce fichier se trouve dans{' '}
                        <code className="rounded bg-gray-100 px-1">
                            .data/easinvoice.json
                        </code>{' '}
                        dans le dossier du projet. Toutes les fonctionnalités
                        sont disponibles sans compte ni abonnement.
                    </p>
                </section>

                {!recovery && (
                    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-md">
                        <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <Building2 className="h-6 w-6 text-blue-600" />
                            Mon entreprise
                        </h2>
                        <p className="text-gray-700">
                            {profile.company_name ||
                                [profile.firstname, profile.lastname]
                                    .filter(Boolean)
                                    .join(' ') ||
                                'Complétez vos coordonnées pour les afficher sur vos documents.'}
                        </p>
                        <Link
                            href="/profile"
                            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            Modifier mes coordonnées
                        </Link>
                    </section>
                )}

                <section className="space-y-4 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="text-xl font-bold text-gray-900">
                        Sauvegardes
                    </h2>
                    <p className="text-gray-700">
                        Téléchargez régulièrement une copie de toutes vos
                        données, y compris votre logo et les lignes de vos
                        documents. Conservez-la dans un autre dossier ou sur un
                        autre support.
                    </p>
                    {!recovery && (
                        <a
                            href="/api/backup"
                            download
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Télécharger une sauvegarde JSON
                        </a>
                    )}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <h3 className="font-semibold text-gray-900">
                            Restaurer une sauvegarde
                        </h3>
                        <p className="text-sm text-gray-600">
                            Choisissez une sauvegarde JSON exportée depuis cette
                            application (10 Mo maximum).
                        </p>
                        <input
                            ref={fileInput}
                            type="file"
                            accept=".json,application/json"
                            onChange={selectBackup}
                            disabled={restoring}
                            className="block w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 disabled:opacity-50"
                            aria-label="Choisir une sauvegarde JSON à restaurer"
                        />
                        {backup && (
                            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="break-words font-medium text-amber-900">
                                    {backup.name}
                                </p>
                                <p className="text-sm text-amber-900">
                                    La restauration remplacera toutes les
                                    données actuelles. Une copie des données
                                    actuelles sera conservée automatiquement
                                    dans le dossier de données avant le
                                    remplacement.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={restoreBackup}
                                        disabled={restoring}
                                        className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-50"
                                    >
                                        {restoring ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="h-4 w-4" />
                                        )}
                                        {restoring
                                            ? 'Restauration…'
                                            : 'Remplacer mes données par cette sauvegarde'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={restoring}
                                        onClick={() => {
                                            setBackup(null)
                                            if (fileInput.current)
                                                fileInput.current.value = ''
                                        }}
                                        className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}
                        {success && (
                            <p
                                role="status"
                                className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                            >
                                {success}
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </AdLayout>
    )
}
