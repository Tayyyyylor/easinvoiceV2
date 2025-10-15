import React from 'react'
import { InfosList } from './dashboard/InfosList'

interface DetailsTemplateProps {
    title: string
    data: Quotes[] | Invoices[] | Clients[]
    children: React.ReactNode
    link: string
}

export const DetailsTemplate = ({
    title,
    data,
    children,
    link,
}: DetailsTemplateProps) => {
    return (
        <main className="flex h-screen gap-4">
            <aside className="w-80 h-screen sticky top-0 left-0">
                <InfosList title={title} data={data} link={link} />
            </aside>
            <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
                <h1 className="text-2xl font-bold text-center">{title}</h1>
                {children}
            </div>
        </main>
    )
}
