import Account from '@/components/pages/Account'
import { createClient } from '@/utils/supabase/server'

export default async function AccountPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return <Account user={user} />
}
