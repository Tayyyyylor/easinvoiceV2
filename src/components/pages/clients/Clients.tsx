'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const Clients = ({ clients }: { clients: Clients[] }) => {
    const router = useRouter()
    return (
        <main className="flex-col h-screen gap-4">
            <h1 className="text-2xl font-bold text-center">Clients</h1>
            <section className="flex gap-4 items-center justify-center">
                <div className="border flex-1 p-4 rounded-lg">
                    <h2>Clients professionnels</h2>
                    <ul>
                        {clients
                            .filter((client) => client.type === 'company')
                            .map((client) => (
                                <li key={client.id}>
                                    {client.company_name ||
                                        client.firstname +
                                            ' ' +
                                            client.lastname}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="border flex-1 p-4 rounded-lg">
                    <h2>Clients particuliers</h2>
                    <ul>
                        {clients
                            .filter((client) => client.type === 'individual')
                            .map((client) => (
                                <li key={client.id}>
                                    {client.firstname + ' ' + client.lastname}
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
