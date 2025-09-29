import FormAccount from '@/components/endAccount/FormAccount'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function FinalizeAccountPage() {
    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error || !user) {
        redirect('/login')
    }

    return <FormAccount userId={user.id} />
}
