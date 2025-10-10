import { CreateQuote } from '@/components/pages/quotes/CreateQuote'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function CreateQuotePage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('fetch clients error', error)
    }
    return <CreateQuote clients={clients ?? []} />
}
