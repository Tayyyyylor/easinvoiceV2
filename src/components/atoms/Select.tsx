import React from 'react'

interface SelectProps {
    id?: string
    label: string
    name?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { id?: string; value: string; label: string }[]
}

export const Select = ({
    id,
    label,
    name,
    value,
    onChange,
    options,
}: SelectProps) => {
    return (
        <div>
            <label
                htmlFor={id || name}
                className="text-s text-darkGray font-bold mr-2"
            >
                {label}
            </label>
            <select
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                className="border border-darkGray rounded-md p-2 "
            >
                {options.map((option, index) => (
                    <option value={option.value} key={option.id || index}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input type="hidden" name={name} value={value} />
        </div>
    )
}
