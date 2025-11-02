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
    const getStatus = () => {
        if (status_label === 'draft') {
            return 'Brouillon'
        }
        if (status_label === 'published') {
            return 'Publié'
        }
        return 'Brouillon'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }
    return (
        <button
            className="border rounded-lg p-4 w-full flex flex-col gap-8 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-col items-start">
                <div className="flex gap-2 items-center">
                    <h3 className="text-lg font-bold text-darkGray">{title}</h3>
                    <p className="text-sm text-gray-500">{getStatus()}</p>
                </div>
                <p className="text-sm text-gray-500">{name}</p>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <p className="text-s text-mainBlue font-bold">{price}€</p>
                <p className="text-sm text-darkGray font-bold">
                    {formatDate(created_at)}
                </p>
            </div>
        </button>
    )
}
