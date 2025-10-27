import { EditInvoice } from '@/components/pages/invoices/EditInvoice'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function EditInvoicePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    const { id } = await params
    const invoiceId = Number(id)

    const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select(
            `
                *,
                invoice_items (*)
            `
        )
        .eq('id', invoiceId)
        .eq('owner_id', user.id)
        .single()

    if (clientsError || invoiceError || !invoice) {
        console.error('fetch clients error', clientsError)
        console.error('fetch invoice error', invoiceError)
    }
    return (
        <EditInvoice
            initialData={{ invoice, items: invoice.invoice_items ?? [] }}
            clients={clients ?? []}
        />
    )
}
