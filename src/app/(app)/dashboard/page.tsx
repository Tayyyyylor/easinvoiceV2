import Dashboard from '@/components/pages/Dashboard'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function DashboardPage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (invoicesError) {
        console.error('fetch invoices error', invoicesError)
    }

    if (error) {
        console.error('fetch clients error', error)
    }

    if (quotesError) {
        console.error('fetch quotes error', quotesError)
    }

    return (
        <Dashboard
            clients={clients ?? []}
            quotes={quotes ?? []}
            invoices={invoices ?? []}
        />
    )
}
