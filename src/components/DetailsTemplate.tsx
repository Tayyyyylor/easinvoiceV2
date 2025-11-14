import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { DetailsCard } from './atoms/DetailsCard'
import { FilterButtons, FilterOption } from './atoms/FilterButtons'
import { AdLayout } from './layouts/AdLayout'
import { Plus } from 'lucide-react'

interface DetailsTemplateProps {
    titleButton: string[]
    data: Quotes[] | Invoices[]
    link: string
}

type FilterStatus = 'all' | 'draft' | 'published'

export const DetailsTemplate = ({
    titleButton,
    data,
    link,
}: DetailsTemplateProps) => {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterStatus>('all')

    const filterOptions: FilterOption<FilterStatus>[] = [
        { value: 'all', label: titleButton[0] },
        { value: 'draft', label: titleButton[1] },
        { value: 'published', label: titleButton[2] },
    ]

    const filteredData = useMemo(() => {
        if (filter === 'all') return data
        return data.filter((dt) => dt.status === filter)
    }, [data, filter])

    const getIcon = () => {
        if (link === 'quotes') {
            return (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            )
        }
        return (
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        )
    }

    return (
        <AdLayout>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                link === 'quotes'
                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                            }`}
                        >
                            {getIcon()}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {link === 'quotes'
                                    ? 'Mes Devis'
                                    : 'Mes Factures'}
                            </h1>
                            <p className="text-gray-600">
                                {filteredData.length}{' '}
                                {filteredData.length > 1
                                    ? 'résultats'
                                    : 'résultat'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push(`/${link}/create`)}
                        className={`px-6 py-6 text-lg font-semibold shadow-lg flex items-center gap-2 ${
                            link === 'quotes'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }`}
                    >
                        <Plus className="w-5 h-5" />
                        {titleButton[3]}
                    </Button>
                </div>

                {/* Filtres */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <FilterButtons
                        options={filterOptions}
                        currentFilter={filter}
                        onFilterChange={setFilter}
                    />
                </div>
            </div>

            {/* Liste des documents */}
            <div className="grid gap-4">
                {filteredData.length > 0 ? (
                    filteredData.map((data) => (
                        <DetailsCard
                            key={data.id}
                            title={
                                'formatted_no' in data &&
                                data.formatted_no &&
                                data.status === 'published'
                                    ? data.formatted_no
                                    : data.name ||
                                      ('formatted_no' in data
                                          ? data.formatted_no
                                          : '') ||
                                      `#${data.id}`
                            }
                            name={data.name}
                            price={data.total_cents / 100}
                            created_at={data.created_at}
                            status_label={data.status}
                            onClick={() => router.push(`/${link}/${data.id}`)}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {getIcon()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Aucun {link === 'quotes' ? 'devis' : 'facture'}{' '}
                            trouvé
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Commencez par créer votre premier{' '}
                            {link === 'quotes' ? 'devis' : 'facture'}
                        </p>
                        <Button
                            onClick={() => router.push(`/${link}/create`)}
                            className={`${
                                link === 'quotes'
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                            }`}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {titleButton[3]}
                        </Button>
                    </div>
                )}
            </div>
        </AdLayout>
    )
}
