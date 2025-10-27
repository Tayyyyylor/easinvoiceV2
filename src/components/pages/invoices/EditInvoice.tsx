import { FormInvoices } from '@/components/invoices/FormInvoices'
import React from 'react'

export const EditInvoice = ({
    initialData,
    clients,
}: {
    initialData: { invoice: Invoices; items: InvoiceItems[] }
    clients: Clients[]
}) => {
    return <FormInvoices clients={clients} initialData={initialData} />
}
