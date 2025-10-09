import { QuoteDetails } from '@/components/pages/QuoteDetails'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function QuoteDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const quoteId = Number(params.id)

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
