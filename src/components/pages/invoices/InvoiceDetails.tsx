'use client'
import React from 'react'
import dynamic from 'next/dynamic'
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
    { ssr: false }
)
import { useAuth } from '@/contexts/useAuth'
import { InvoicePdf } from '@/components/pdf/InvoicePdf'

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
    const download = async () => {
        const res = await fetch(`/api/invoices/${invoice.id}/pdf`, {
            cache: 'no-store',
        })
        if (!res.ok) return
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `devis-${invoice.id}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl">Devis #{invoice.id}</h1>
            <div className="space-x-3">
                <button className="border px-3 py-1 rounded" onClick={download}>
                    Télécharger le PDF
                </button>
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
