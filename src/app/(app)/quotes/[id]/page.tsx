import { QuoteDetails } from '@/components/pages/quotes/QuoteDetails'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'
import { redirect } from 'next/navigation'

export default async function QuoteDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { user, supabase } = await getAuthenticatedUser()
    const { id } = await params
    const quoteId = Number(id)

    const { data: quote, error } = await supabase
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

    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', quote.client_id)
        .eq('owner_id', user.id)
        .single()

    if (error || !quote || clientError || !client) redirect('/quotes')

    // Récupération explicite des items (au cas où l'embed est vide selon RLS/FK)
    const { data: items } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', quoteId)
        .order('id', { ascending: true })

    return (
        <QuoteDetails
            quote={quote}
            items={items ?? quote.quote_items ?? []}
            client={client ?? null}
        />
    )
}
