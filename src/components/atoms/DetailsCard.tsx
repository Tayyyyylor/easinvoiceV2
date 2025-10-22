import React from 'react'

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
    return (
        <button
            className="border rounded-lg p-4 w-full flex flex-col gap-8 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-col items-start">
                <div className="flex gap-2 items-center">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-sm text-gray-500">{status_label}</p>
                </div>
                <p className="text-sm text-gray-500">{name}</p>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <p className="text-sm text-gray-500">{price}€</p>
                <p>{created_at}</p>
            </div>
        </button>
    )
}
