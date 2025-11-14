import React from 'react'
import { Calendar, Tag, FileCheck, Crown } from 'lucide-react'
import { formatDateShort, formatPrice } from '@/helpers/formatters'

interface DetailsCardProps {
    title: string
    name: string
    price: number
    created_at: string
    status_label: string
    onClick: () => void
    isQuote?: boolean
    onConvert?: () => void
    isSubscribed?: boolean
}

export const DetailsCard = ({
    title,
    name,
    price,
    created_at,
    status_label,
    onClick,
    isQuote = false,
    onConvert,
    isSubscribed = false,
}: DetailsCardProps) => {
    const getStatus = () => {
        if (status_label === 'draft') {
            return 'Brouillon'
        }
        if (status_label === 'published') {
            return 'Publié'
        }
        return 'Brouillon'
    }

    const showConvertButton =
        isQuote && status_label === 'published' && onConvert

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl p-6 w-full hover:shadow-lg hover:border-blue-300 transition-all transform hover:scale-[1.02] cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* En-tête avec titre et badge */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                {title}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                    status_label === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                                {getStatus()}
                            </span>
                        </div>

                        {/* Bouton de conversion compact en haut à droite */}
                        {showConvertButton && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onConvert()
                                }}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                    isSubscribed
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md'
                                }`}
                                title={
                                    isSubscribed
                                        ? 'Convertir en facture'
                                        : 'Fonctionnalité Premium'
                                }
                            >
                                {isSubscribed ? (
                                    <>
                                        <FileCheck className="w-3.5 h-3.5" />
                                        Facture
                                    </>
                                ) : (
                                    <>
                                        <Crown className="w-3.5 h-3.5" />
                                        Convertir en facture
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Nom/Description */}
                    <p className="text-sm text-gray-600 mb-4 truncate">
                        {name}
                    </p>

                    {/* Footer avec prix et date */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span className="text-lg font-bold text-blue-600">
                                {formatPrice(price)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {formatDateShort(created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
