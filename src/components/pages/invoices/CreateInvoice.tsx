import { FormInvoices } from '@/components/invoices/FormInvoices'
import React from 'react'

export const CreateInvoice = ({ clients }: { clients: Clients[] }) => {
    return <FormInvoices clients={clients} />
}
