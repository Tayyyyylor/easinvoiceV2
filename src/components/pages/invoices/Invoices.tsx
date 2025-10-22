'use client'
import { DetailsTemplate } from '@/components/DetailsTemplate'

export const Invoices = ({ invoices }: { invoices: Invoices[] }) => {
    return (
        <DetailsTemplate
            titleButton={[
                'Toutes les factures',
                'Factures provisoires',
                'Factures finalisées',
                'Créer une facture',
            ]}
            data={invoices}
            link="invoices"
        />
    )
}
