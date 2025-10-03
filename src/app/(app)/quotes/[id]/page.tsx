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
      id, status, number, currency, created_at, updated_at, issue_date, expiry_date,
      buyer_name, buyer, buyer_email, buyer_tax_id, buyer_address,
      subtotal_cents, tax_cents, total_cents, seller, pdf_path
    `
        )
        .eq('id', quoteId)
        .single()

    if (error || !quote) redirect('/quotes')

    return <QuoteDetails quote={quote} />
}
