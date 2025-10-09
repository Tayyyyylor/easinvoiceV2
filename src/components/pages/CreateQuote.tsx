/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormQuotes } from '../quotes/FormQuotes'

export const CreateQuote = ({ clients }: { clients: any[] }) => {
    return <FormQuotes clients={clients} />
}
