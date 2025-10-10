/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormQuotes } from '@/components/quotes/FormQuotes'
import React from 'react'

export const CreateQuote = ({ clients }: { clients: any[] }) => {
    return <FormQuotes clients={clients} />
}
