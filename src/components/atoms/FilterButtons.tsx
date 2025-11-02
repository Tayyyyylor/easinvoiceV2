import React from 'react'

export interface FilterOption<T extends string> {
    value: T
    label: string
}

interface FilterButtonsProps<T extends string> {
    options: FilterOption<T>[]
    currentFilter: T
    onFilterChange: (filter: T) => void
    className?: string
}

export const FilterButtons = <T extends string>({
    options,
    currentFilter,
    onFilterChange,
    className = '',
}: FilterButtonsProps<T>) => {
    const getButtonClass = (value: T) => {
        const baseClass = 'border px-3 py-1 rounded transition-colors'
        return currentFilter === value
            ? `${baseClass} bg-black text-white`
            : `${baseClass} hover:bg-gray-100`
    }

    return (
        <section className={`flex gap-2 ${className}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={getButtonClass(option.value)}
                    onClick={() => onFilterChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </section>
    )
}
