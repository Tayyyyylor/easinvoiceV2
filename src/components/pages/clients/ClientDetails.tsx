'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export const ClientDetails = ({ client }: { client: Clients }) => {
    const router = useRouter()
    console.log(client)
    return (
        <main className="flex-col h-screen gap-4">
            <h1 className="text-2xl font-bold text-center">Client Details</h1>
            <article className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">Informations</h2>
                <p>
                    {client.firstname} {client.lastname}
                </p>
                <p>{client.email}</p>
                <p>{client.phone}</p>
                <p>{client.address}</p>
                <p>{client.city}</p>
                <p>{client.zipcode}</p>
                <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={() => router.push(`/clients/${client.id}/edit`)}
                >
                    Modifier
                </button>
            </article>
        </main>
    )
}
