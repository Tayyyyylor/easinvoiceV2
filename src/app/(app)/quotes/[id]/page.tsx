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
        .select('id')
        .eq('id', quoteId)
        .single()

    if (error || !quote) redirect('/quotes')

    return <QuoteDetails quote={quote} />
}
