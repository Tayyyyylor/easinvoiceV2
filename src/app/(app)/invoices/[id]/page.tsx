import { InvoiceDetails } from '@/components/pages/invoices/InvoiceDetails'
import { getClient, getDocument } from '@/lib/local-store'
import { notFound } from 'next/navigation'

export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const document = await getDocument('invoice', recordId)
    if (!document) notFound()
    const client = await getClient(document.client_id)
    if (!client) notFound()

    return (
        <InvoiceDetails
            invoice={document}
            items={document.items.map((item) => ({
                ...item,
                invoice_id: document.id,
            }))}
            client={client}
        />
    )
}
