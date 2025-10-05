/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'

type FormfieldProps = {
    form: any
    name: string
    label: string
    placeholder: string
    type?: string
}

export const Formfield = ({
    form,
    name,
    label,
    placeholder,
    type = 'text',
}: FormfieldProps) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            type={type}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
