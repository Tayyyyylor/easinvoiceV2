import { FormClients } from '@/components/clients/FormClients'
import React from 'react'

export const EditClient = ({ initialData }: { initialData: Clients }) => {
    return <FormClients initialData={initialData} />
}
