import { Quotes } from '@/components/pages/quotes/Quotes'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function QuotesPage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('fetch quotes error', error)
    }

    return <Quotes quotes={quotes ?? []} />
}
