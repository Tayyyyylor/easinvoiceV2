/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'

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
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                placeholder={placeholder}
                                {...field}
                                type={
                                    type === 'password'
                                        ? showPassword
                                            ? 'text'
                                            : 'password'
                                        : type
                                }
                                className="pr-10"
                            />
                            {type === 'password' && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                </FormItem>
            )}
        />
    )
}
