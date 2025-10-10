import { Invoices } from '@/components/pages/invoices/Invoices'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function InvoicesPage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('fetch invoices error', error)
    }

    return <Invoices invoices={invoices ?? []} />
}
