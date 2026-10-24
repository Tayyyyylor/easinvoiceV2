import { EditInvoice } from '@/components/pages/invoices/EditInvoice'
import { getDocument, listClients } from '@/lib/local-store'
import { notFound, redirect } from 'next/navigation'

export default async function EditInvoicePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const recordId = Number(id)
    if (!Number.isSafeInteger(recordId) || recordId <= 0) notFound()
    const document = await getDocument('invoice', recordId)
    if (!document) notFound()
    if (document.status !== 'draft') redirect(`/invoices/${document.id}`)
    const clients = await listClients()

    return (
        <EditInvoice
            initialData={{
                invoice: document,
                items: document.items.map((item) => ({
                    ...item,
                    invoice_id: document.id,
                })),
            }}
            clients={clients}
        />
    )
}
