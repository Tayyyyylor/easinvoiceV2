import { CreateQuote } from '@/components/pages/CreateQuote'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreateQuotePage() {
    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error || !user) {
        redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    if (profileError) {
        console.error(profileError)
    }

    return <CreateQuote user={user} profile={profile} />
}
