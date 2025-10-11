import { InvoiceDetails } from '@/components/pages/invoices/InvoiceDetails'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'
import { redirect } from 'next/navigation'

export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { user, supabase } = await getAuthenticatedUser()

    const { id } = await params
    const invoiceId = Number(id)

    const { data: invoice, error } = await supabase
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

    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .eq('owner_id', user.id)
        .single()

    if (error || !invoice || clientError || !client) redirect('/invoices')

    // Récupération explicite des items (au cas où l'embed est vide selon RLS/FK)
    const { data: items } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('id', { ascending: true })

    return (
        <InvoiceDetails
            invoice={invoice}
            items={items ?? invoice.invoice_items ?? []}
            client={client ?? null}
        />
    )
}
