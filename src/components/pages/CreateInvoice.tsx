/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { FormInvoices } from '../invoices/FormInvoices'

export const CreateInvoice = ({ clients }: { clients: any[] }) => {
    return <FormInvoices clients={clients} />
}
