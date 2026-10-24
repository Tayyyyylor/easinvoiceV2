import { FormProfile } from '@/components/profile/FormProfile'
import { getProfile } from '@/lib/local-store'

export default async function ProfilePage() {
    const profile = await getProfile()

    return (
        <div className="container mx-auto py-8">
            <FormProfile initialData={profile} />
        </div>
    )
}
