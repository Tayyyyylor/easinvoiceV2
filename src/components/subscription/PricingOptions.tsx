'use client'
import CheckoutButton from '../atoms/CheckoutButton'

interface PricingOption {
    id: string
    name: string
    price: number
    interval: 'month' | 'year'
    features: string[]
}

const pricingOptions: PricingOption[] = [
    {
        id: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY as string,
        name: 'Abonnement Mensuel',
        price: 9.99, // Remplacez par votre prix
        interval: 'month',
        features: [
            'Factures illimitées',
            'Devis illimités',
            'Support client',
            'Paiement mensuel flexible',
        ],
    },
    {
        id: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY as string,
        name: 'Abonnement Annuel',
        price: 90.99, // Remplacez par votre prix
        interval: 'year',
        features: [
            'Toutes les fonctionnalités mensuelles',
            'Deux mois gratuits',
            'Support prioritaire',
            'Prix avantageux',
        ],
    },
]

export default function PricingOptions({ userId }: { userId: string }) {
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto p-4">
            {pricingOptions.map((option) => (
                <div
                    key={option.id}
                    className="rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                    <h3 className="text-xl font-bold mb-4">{option.name}</h3>
                    <div className="mb-4">
                        <span className="text-3xl font-bold">
                            {option.price}€
                        </span>
                        <span className="text-gray-500">
                            /{option.interval}
                        </span>
                    </div>
                    <ul className="mb-6 space-y-2">
                        {option.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <CheckoutButton
                        priceId={option.id}
                        supabaseUserId={userId}
                    />
                </div>
            ))}
        </div>
    )
}
