import { FormQuotes } from '@/components/quotes/FormQuotes'
import React from 'react'

export const CreateQuote = ({ clients }: { clients: Clients[] }) => {
    return <FormQuotes clients={clients} />
}
