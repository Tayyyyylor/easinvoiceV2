import { EditQuote } from '@/components/pages/quotes/EditQuote'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function EditQuotePage({
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
    const quoteId = Number(id)

    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select(
            `
                *,
                quote_items (*)
            `
        )
        .eq('id', quoteId)
        .eq('owner_id', user.id)
        .single()

    if (clientsError || quoteError || !quote) {
        console.error('fetch clients error', clientsError)
        console.error('fetch quote error', quoteError)
    }
    return (
        <EditQuote
            initialData={{ quote, items: quote.quote_items ?? [] }}
            clients={clients ?? []}
        />
    )
}
