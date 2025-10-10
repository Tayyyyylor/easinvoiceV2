import { CreateInvoice } from '@/components/pages/invoices/CreateInvoice'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function CreateInvoicePage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('fetch clients error', error)
    }
    return <CreateInvoice clients={clients ?? []} />
}
