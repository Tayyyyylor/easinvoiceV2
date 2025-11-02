import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { DetailsCard } from './atoms/DetailsCard'
import { FilterButtons, FilterOption } from './atoms/FilterButtons'

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

    return (
        <main className="flex flex-col gap-4 max-w-4xl mx-auto p-4 border h-screen">
            <article className="flex gap-2 justify-between items-center flex-col md:flex-row">
                <FilterButtons
                    options={filterOptions}
                    currentFilter={filter}
                    onFilterChange={setFilter}
                />
                <Button
                    onClick={() => router.push(`/${link}/create`)}
                    className="bg-mainBlue text-white hover:bg-mainBlueLight cursor-pointer"
                >
                    {titleButton[3]}
                </Button>
            </article>
            <article>
                {filteredData.map((data) => (
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
                ))}
            </article>
        </main>
    )
}
