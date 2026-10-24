'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const links = [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/clients', label: 'Clients' },
    { href: '/quotes', label: 'Devis' },
    { href: '/invoices', label: 'Factures' },
    { href: '/profile', label: 'Mon entreprise' },
    { href: '/settings', label: 'Paramètres' },
]

export const Header = () => {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3"
                    aria-label="Easinvoice, tableau de bord"
                >
                    <Image
                        src="/logo_black.png"
                        alt="Easinvoice"
                        width={90}
                        height={25}
                        className="h-auto w-[90px]"
                        priority
                    />
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Local
                    </span>
                </Link>
                <nav
                    aria-label="Navigation principale"
                    className="flex flex-1 flex-wrap gap-1 text-sm"
                >
                    {links.map(({ href, label }) => {
                        const active =
                            pathname === href || pathname.startsWith(`${href}/`)
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`rounded-lg px-3 py-2 font-medium transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
