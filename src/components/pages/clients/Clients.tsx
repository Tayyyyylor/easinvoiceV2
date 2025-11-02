'use client'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FilterButtons, FilterOption } from '@/components/atoms/FilterButtons'

type FilterStatus = 'all' | 'company' | 'individual'

export const Clients = ({ clients }: { clients: Clients[] }) => {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterStatus>('all')
    const filteredClients = useMemo(() => {
        if (filter === 'all') return clients
        return clients.filter((client) => client.type === filter)
    }, [clients, filter])
    const filterOptions: FilterOption<FilterStatus>[] = [
        { value: 'all', label: 'Tous' },
        { value: 'company', label: 'Professionnels' },
        { value: 'individual', label: 'Particuliers' },
    ]
    return (
        <main className="flex-col h-screen gap-4">
            <h2 className="text-2xl font-bold text-center">Clients</h2>
            <FilterButtons
                options={filterOptions}
                currentFilter={filter}
                onFilterChange={setFilter}
            />
            <section className="flex gap-4 items-center justify-center">
                <div className="border flex-1 p-4 rounded-lg">
                    <h2>
                        {filter === 'all' && 'Tous les clients'}
                        {filter === 'company' && 'Clients professionnels'}
                        {filter === 'individual' && 'Clients particuliers'}
                    </h2>
                    <ul>
                        {filteredClients.map((client) => (
                            <li key={client.id}>
                                <Link href={`/clients/${client.id}`}>
                                    {client.company_name ||
                                        client.firstname +
                                            ' ' +
                                            client.lastname}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            <Button onClick={() => router.push('/clients/create')}>
                Créer un client
            </Button>
        </main>
    )
}
