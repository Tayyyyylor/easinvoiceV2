import React from 'react'
import { Button } from '@/components/ui/button'
import { getItemName } from '@/helpers'

interface DashboardCardProps {
    title: string
    buttonLabel: string
    onClick: () => void
    onClickMore: () => void
    data?: Quotes[] | Invoices[] | Clients[]
}

export const DashboardCard = ({
    title,
    buttonLabel,
    onClick,
    onClickMore,
    data,
}: DashboardCardProps) => {
    return (
        <section className="border rounded-lg p-4 flex-1 w-full flex flex-col gap-4">
            <div className="flex gap-10 items-center justify-between">
                <h3 className="text-2xl font-bold">{title}</h3>
                <Button variant="secondary" onClick={onClick}>
                    {buttonLabel}
                </Button>
            </div>
            <div>
                {data?.map((item) => (
                    <div key={item.id}>{getItemName(item)}</div>
                ))}
            </div>
            <Button onClick={onClickMore} className="w-full">
                Voir plus
            </Button>
        </section>
    )
}
