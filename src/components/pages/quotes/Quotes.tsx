'use client'
import { DetailsTemplate } from '@/components/DetailsTemplate'

export const Quotes = ({ quotes }: { quotes: Quotes[] }) => {
    return (
        <DetailsTemplate
            titleButton={[
                'Tous les devis',
                'Devis provisoires',
                'Devis finalisés',
                'Créer un devis',
            ]}
            data={quotes}
            link="quotes"
        />
    )
}
