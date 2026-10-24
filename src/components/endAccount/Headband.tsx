import Link from 'next/link'

export const Headband = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <p>
            Renseignez votre entreprise pour afficher vos coordonnées sur vos
            devis et factures.
        </p>
        <Link
            href="/profile"
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 shadow-sm hover:bg-blue-100"
        >
            Compléter mon entreprise
        </Link>
    </div>
)
