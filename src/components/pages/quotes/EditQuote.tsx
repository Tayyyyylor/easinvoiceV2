import { FormQuotes } from '@/components/quotes/FormQuotes'
import React from 'react'

export const EditQuote = ({
    initialData,
    clients,
}: {
    initialData: { quote: Quotes; items: QuoteItems[] }
    clients: Clients[]
}) => {
    return <FormQuotes clients={clients} initialData={initialData} />
}
