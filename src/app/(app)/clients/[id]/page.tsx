import { ClientDetails } from '@/components/pages/clients/ClientDetails'
import { getClient } from '@/lib/local-store'
import { notFound } from 'next/navigation'

export default async function ClientDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const client = await getClient(recordId)
    if (!client) notFound()
    return <ClientDetails client={client} />
}
