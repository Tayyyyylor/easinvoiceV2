'use client'
import React from 'react'
import dynamic from 'next/dynamic'
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
    { ssr: false }
)
import { QuotePdf } from '@/components/pdf/QuotePdf'
import { useAuth } from '@/contexts/useAuth'

export const QuoteDetails = ({
    quote,
    items = [],
    client,
}: {
    quote: Quotes
    items?: QuoteItems[]
    client?: Clients
}) => {
    const { profile } = useAuth()
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

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl">Devis #{quote.id}</h1>
            <div className="space-x-3">
                <button className="border px-3 py-1 rounded" onClick={download}>
                    Télécharger le PDF
                </button>
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
        </div>
    )
}
