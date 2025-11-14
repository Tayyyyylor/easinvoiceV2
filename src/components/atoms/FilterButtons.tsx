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
        const baseClass =
            'px-4 py-2.5 rounded-lg font-medium transition-all transform'
        return currentFilter === value
            ? `${baseClass} bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105`
            : `${baseClass} bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102`
    }

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={getButtonClass(option.value) + ' cursor-pointer'}
                    onClick={() => onFilterChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
