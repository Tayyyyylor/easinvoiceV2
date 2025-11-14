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
import { AdLayout } from '@/components/layouts/AdLayout'
import {
    Download,
    Check,
    Edit,
    AlertCircle,
    FileText,
    User,
    Calendar,
} from 'lucide-react'
import { formatDateLong, formatPriceFromCents } from '@/helpers/formatters'

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
        <AdLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Devis #{quote.id}
                                </h1>
                                <p className="text-gray-600">{quote.name}</p>
                            </div>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                isDraft
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                        >
                            {isDraft ? '📝 Provisoire' : '✅ Finalisé'}
                        </span>
                    </div>

                    {/* Informations du devis */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Client</p>
                                <p className="font-semibold text-gray-900">
                                    {client?.company_name ||
                                        `${client?.firstname} ${client?.lastname}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Date de création
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {formatDateLong(quote.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-green-600">
                                    €
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Montant total
                                </p>
                                <p className="font-bold text-xl text-gray-900">
                                    {formatPriceFromCents(quote.total_cents)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
                            onClick={download}
                        >
                            <Download className="w-5 h-5" />
                            Télécharger le PDF
                        </button>

                        {isDraft && !showConfirm && (
                            <>
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    <Check className="w-5 h-5" />
                                    Finaliser le devis
                                </button>
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
                                    onClick={() =>
                                        router.push(`/quotes/${quote.id}/edit`)
                                    }
                                >
                                    <Edit className="w-5 h-5" />
                                    Modifier
                                </button>
                            </>
                        )}

                        {showConfirm && (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <span className="text-sm font-medium text-amber-900">
                                    Confirmer la finalisation ?
                                </span>
                                <form
                                    action={finalizeQuote}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="hidden"
                                        name="quote_id"
                                        value={quote.id}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Oui
                                    </button>
                                </form>
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        )}

                        {!isDraft && (
                            <div className="flex items-center gap-2 text-gray-500 italic bg-gray-50 px-4 py-3 rounded-xl">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">
                                    Ce devis est finalisé et ne peut plus être
                                    modifié
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Prévisualisation PDF */}
                <div className="bg-white rounded-2xl shadow-lg p-2 overflow-hidden">
                    <div className="h-[80vh] rounded-xl overflow-hidden">
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
            </div>
        </AdLayout>
    )
}
