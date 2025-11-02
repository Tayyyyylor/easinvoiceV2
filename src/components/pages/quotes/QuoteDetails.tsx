'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
    { ssr: false }
)
import { QuotePdf } from '@/components/pdf/QuotePdf'
import { useAuth } from '@/contexts/useAuth'
import { finalizeQuote } from '@/app/(app)/quotes/action'
import { useRouter } from 'next/navigation'

export const QuoteDetails = ({
    quote,
    items = [],
    client,
}: {
    quote: Quotes
    items?: QuoteItems[]
    client?: Clients
}) => {
    const router = useRouter()
    const { profile } = useAuth()
    const [showConfirm, setShowConfirm] = useState(false)

    const download = async () => {
        const res = await fetch(`/api/quotes/${quote.id}/pdf`, {
            cache: 'no-store',
        })
        if (!res.ok) return
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `devis-${quote.id}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    const isDraft = quote.status === 'draft'

    return (
        <main className="p-6 space-y-4 max-w-4xl mx-auto">
            <section className="flex items-center gap-3">
                <h2 className="text-xl">Devis #{quote.id}</h2>
                <span
                    className={`px-3 py-1 rounded text-sm ${
                        isDraft
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                >
                    {isDraft ? 'Provisoire' : 'Finalisé'}
                </span>
            </section>

            <div className="space-x-3">
                <button
                    className="border px-3 py-1 rounded bg-mainBlue text-white hover:bg-mainBlueLight cursor-pointer"
                    onClick={download}
                >
                    Télécharger le PDF
                </button>

                {isDraft && !showConfirm && (
                    <button
                        className="border px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                        onClick={() => setShowConfirm(true)}
                    >
                        Finaliser le devis
                    </button>
                )}
                {isDraft && (
                    <button
                        className="border px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-800"
                        onClick={() => router.push(`/quotes/${quote.id}/edit`)}
                    >
                        Modifier le devis
                    </button>
                )}

                {showConfirm && (
                    <div className="inline-flex items-center gap-2 border rounded px-3 py-1 bg-yellow-50">
                        <span className="text-sm">
                            Confirmer la finalisation ?
                        </span>
                        <form
                            action={finalizeQuote}
                            className="inline-flex gap-2"
                        >
                            <input
                                type="hidden"
                                name="quote_id"
                                value={quote.id}
                            />
                            <button
                                type="submit"
                                className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                Oui
                            </button>
                        </form>
                        <button
                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                            onClick={() => setShowConfirm(false)}
                        >
                            Annuler
                        </button>
                    </div>
                )}

                {!isDraft && (
                    <span className="text-sm text-gray-500 italic">
                        Ce devis est finalisé et ne peut plus être modifié
                    </span>
                )}
            </div>
            <div className="h-[80vh] border rounded overflow-hidden">
                <PDFViewer width="100%" height="100%" showToolbar>
                    <QuotePdf
                        quote={quote}
                        items={items}
                        emitter={profile}
                        client={client}
                        theme={quote.pdf_overrides ?? {}}
                    />
                </PDFViewer>
            </div>
        </main>
    )
}
