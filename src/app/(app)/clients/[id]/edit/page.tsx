import { EditClient } from '@/components/pages/clients/EditClient'
import { getClient } from '@/lib/local-store'
import { notFound } from 'next/navigation'

export default async function EditClientPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const client = await getClient(recordId)
    if (!client) notFound()
    return <EditClient initialData={client} />
}
