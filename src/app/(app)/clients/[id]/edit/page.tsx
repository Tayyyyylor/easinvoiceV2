import { EditClient } from '@/components/pages/clients/EditClient'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function EditClientPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { user, supabase } = await getAuthenticatedUser()

    const { id } = await params
    const clientId = Number(id)

    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('owner_id', user.id)
        .single()

    if (clientError || !client) {
        console.error('fetch clients error', clientError)
    }
    return <EditClient initialData={client} />
}
