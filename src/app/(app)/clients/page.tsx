import { Clients } from '@/components/pages/clients/Clients'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function ClientsPage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('fetch clients error', error)
    }

    return <Clients clients={clients ?? []} />
}
