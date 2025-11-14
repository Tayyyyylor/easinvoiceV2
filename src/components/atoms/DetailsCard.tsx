import React from 'react'
import { Calendar, Tag } from 'lucide-react'
import { formatDateShort, formatPrice } from '@/helpers/formatters'

interface DetailsCardProps {
    title: string
    name: string
    price: number
    created_at: string
    status_label: string
    onClick: () => void
}

export const DetailsCard = ({
    title,
    name,
    price,
    created_at,
    status_label,
    onClick,
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

    return (
        <button
            className="bg-white border border-gray-200 rounded-xl p-6 w-full hover:shadow-lg hover:border-blue-300 transition-all transform hover:scale-[1.02] cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* En-tête avec titre et badge */}
                    <div className="flex items-center gap-3 mb-2">
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
        </button>
    )
}
