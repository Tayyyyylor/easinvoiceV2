import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layouts/header/Header'

export const metadata: Metadata = {
    title: 'Easinvoice — Devis et factures',
    description:
        'Vos clients, devis et factures enregistrés sur votre ordinateur.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="fr">
            <body className="antialiased bg-backgroundLight">
                <Header />
                {children}
            </body>
        </html>
    )
}
