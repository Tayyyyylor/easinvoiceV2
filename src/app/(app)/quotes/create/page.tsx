import { CreateQuote } from '@/components/pages/CreateQuote'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreateQuotePage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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
