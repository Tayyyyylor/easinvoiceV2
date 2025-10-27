import { ClientDetails } from '@/components/pages/clients/ClientDetails'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function ClientDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { user, supabase } = await getAuthenticatedUser()

    const { id } = await params
    const clientId = Number(id)

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('owner_id', user.id)
        .single()

    if (error) {
        console.error('fetch clients error', error)
    }

    return <ClientDetails client={clients ?? {}} />
}
