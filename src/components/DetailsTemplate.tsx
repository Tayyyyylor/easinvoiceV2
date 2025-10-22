import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { DetailsCard } from './atoms/DetailsCard'

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

    const filteredData = useMemo(() => {
        if (filter === 'all') return data
        return data.filter((dt) => dt.status === filter)
    }, [data, filter])

    console.log('filteredData', filteredData)

    const getButtonClass = (status: FilterStatus) => {
        const baseClass = 'border px-3 py-1 rounded transition-colors'
        return filter === status
            ? `${baseClass} bg-black text-white`
            : `${baseClass} hover:bg-gray-100`
    }

    return (
        <main className="flex flex-col gap-4 max-w-4xl mx-auto p-4 border h-screen">
            <article className="flex gap-2 justify-between items-center">
                <div className="flex gap-2">
                    <button
                        className={getButtonClass('all')}
                        onClick={() => setFilter('all')}
                    >
                        {titleButton[0]}
                    </button>
                    <button
                        className={getButtonClass('draft')}
                        onClick={() => setFilter('draft')}
                    >
                        {titleButton[1]}
                    </button>
                    <button
                        className={getButtonClass('published')}
                        onClick={() => setFilter('published')}
                    >
                        {titleButton[2]}
                    </button>
                </div>
                <Button onClick={() => router.push(`/${link}/create`)}>
                    {titleButton[3]}
                </Button>
            </article>
            <article>
                {filteredData.map((data) => (
                    <DetailsCard
                        key={data.id}
                        title={
                            data.name ||
                            ('formatted_no' in data ? data.formatted_no : '')
                        }
                        name={data.name}
                        price={data.total_cents / 100}
                        created_at={data.created_at}
                        status_label={data.status}
                        onClick={() => router.push(`/${link}/${data.id}`)}
                    />
                ))}
            </article>
        </main>
    )
}
