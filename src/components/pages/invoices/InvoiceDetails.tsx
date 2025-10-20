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

export const InvoiceDetails = ({
    invoice,
    items = [],
    client,
}: {
    invoice: Invoices
    items?: InvoiceItems[]
    client?: Clients
}) => {
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
        a.download = `facture-${invoice.id}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    const isDraft = invoice.status === 'draft'

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
                <h1 className="text-xl">Facture #{invoice.id}</h1>
                <span
                    className={`px-3 py-1 rounded text-sm ${
                        isDraft
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                >
                    {isDraft ? 'Provisoire' : 'Finalisée'}
                </span>
            </div>

            <div className="space-x-3">
                <button className="border px-3 py-1 rounded" onClick={download}>
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
        </div>
    )
}
