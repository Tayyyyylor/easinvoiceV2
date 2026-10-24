import Link from 'next/link'

export const Billing = () => (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-12">
        <h1 className="text-2xl font-bold">Version locale</h1>
        <p>
            Toutes les fonctionnalités sont disponibles sur cet ordinateur, sans
            abonnement.
        </p>
        <Link href="/dashboard" className="text-blue-700 underline">
            Ouvrir le tableau de bord
        </Link>
    </main>
)
