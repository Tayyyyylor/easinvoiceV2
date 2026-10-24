import { QuoteDetails } from '@/components/pages/quotes/QuoteDetails'
import { getClient, getDocument } from '@/lib/local-store'
import { notFound } from 'next/navigation'

export default async function QuoteDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const document = await getDocument('quote', recordId)
    if (!document) notFound()
    const client = await getClient(document.client_id)
    if (!client) notFound()

    return (
        <QuoteDetails
            quote={document}
            items={document.items.map((item) => ({
                ...item,
                quote_id: document.id,
            }))}
            client={client}
        />
    )
}
