import { FormProfile } from '@/components/profile/FormProfile'
import { getAuthenticatedUser } from '@/utils/auth/getAuthenticatedUser'

export default async function ProfilePage() {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="container mx-auto py-8">
            <FormProfile initialData={profile} />
        </div>
    )
}
