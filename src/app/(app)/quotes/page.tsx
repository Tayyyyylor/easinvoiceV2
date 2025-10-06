import { Quotes } from '@/components/pages/Quotes'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function QuotesPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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
