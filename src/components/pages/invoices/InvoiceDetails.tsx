'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
    { ssr: false }
)
import { useAuth } from '@/contexts/useAuth'
import { InvoicePdf } from '@/components/pdf/InvoicePdf'
import { finalizeInvoice } from '@/app/(app)/invoices/action'
import { useRouter } from 'next/navigation'

export const InvoiceDetails = ({
    invoice,
    items = [],
    client,
}: {
    invoice: Invoices
    items?: InvoiceItems[]
    client?: Clients
}) => {
    const router = useRouter()
    const { profile } = useAuth()
    const [showConfirm, setShowConfirm] = useState(false)

    const download = async () => {
        const res = await fetch(`/api/invoices/${invoice.id}/pdf`, {
            cache: 'no-store',
        })
        if (!res.ok) return
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture-${invoice.formatted_no}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    const isDraft = invoice.status === 'draft'

    return (
        <main className="p-6 space-y-4 max-w-4xl mx-auto">
            <section className="flex items-center gap-3">
                <h2 className="text-xl">
                    {isDraft ? (
                        `Facture #${invoice.id}`
                    ) : (
                        <span>
                            Facture
                            <span className="font-bold">
                                {invoice.formatted_no}
                            </span>
                        </span>
                    )}
                </h2>
                <span
                    className={`px-3 py-1 rounded text-sm ${
                        isDraft
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                >
                    {isDraft ? 'Provisoire' : 'Finalisée'}
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
                        Finaliser la facture
                    </button>
                )}
                {isDraft && (
                    <button
                        className="border px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-800"
                        onClick={() =>
                            router.push(`/invoices/${invoice.id}/edit`)
                        }
                    >
                        Modifier la facture
                    </button>
                )}

                {showConfirm && (
                    <div className="inline-flex items-center gap-2 border rounded px-3 py-1 bg-yellow-50">
                        <span className="text-sm">
                            Confirmer la finalisation ?
                        </span>
                        <form
                            action={finalizeInvoice}
                            className="inline-flex gap-2"
                        >
                            <input
                                type="hidden"
                                name="invoice_id"
                                value={invoice.id}
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
                        Cette facture est finalisée et ne peut plus être
                        modifiée
                    </span>
                )}
            </div>
            <div className="h-[80vh] border rounded overflow-hidden">
                <PDFViewer width="100%" height="100%" showToolbar>
                    <InvoicePdf
                        invoice={invoice}
                        items={items}
                        emitter={profile}
                        client={client}
                        theme={invoice.pdf_overrides ?? {}}
                    />
                </PDFViewer>
            </div>
        </main>
    )
}
