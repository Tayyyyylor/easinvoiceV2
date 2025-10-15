import { getItemName } from '@/helpers'
import Link from 'next/link'
import React from 'react'

interface InfosListProps {
    title: string
    data: Quotes[] | Invoices[] | Clients[]
    link: string
}

export const InfosList = ({ title, data, link }: InfosListProps) => {
    return (
        <section className="border-r p-4 h-full flex flex-col gap-4">
            <h3 className="font-semibold">{title}</h3>
            <div className="overflow-y-auto flex-1">
                {data?.map((item) => (
                    <div
                        key={item.id}
                        className="py-2 border-b last:border-b-0"
                    >
                        <Link href={`/${link}/${item.id}`}>
                            {getItemName(item)}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
