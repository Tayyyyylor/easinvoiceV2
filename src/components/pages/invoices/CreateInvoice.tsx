/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInvoices } from '@/components/invoices/FormInvoices'
import React from 'react'

export const CreateInvoice = ({ clients }: { clients: any[] }) => {
    return <FormInvoices clients={clients} />
}
