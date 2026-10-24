import { EditQuote } from '@/components/pages/quotes/EditQuote'
import { getDocument, listClients } from '@/lib/local-store'
import { notFound, redirect } from 'next/navigation'

export default async function EditQuotePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const document = await getDocument('quote', recordId)
    if (!document) notFound()
    if (document.status !== 'draft') redirect(`/quotes/${document.id}`)
    const clients = await listClients()

    return (
        <EditQuote
            initialData={{
                quote: document,
                items: document.items.map((item) => ({
                    ...item,
                    quote_id: document.id,
                })),
            }}
            clients={clients}
        />
    )
}
