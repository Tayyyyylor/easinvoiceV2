/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'

export const Formfield = ({
    form,
    name,
    label,
    placeholder,
}: {
    form: any
    name: string
    label: string
    placeholder: string
}) => {
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
                            type="text"
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
