import { AuthProvider } from '@/contexts/useAuth'
import { getProfile } from '@/lib/local-store'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    let profile: Profile
    try {
        profile = await getProfile()
    } catch (error) {
        console.error('Lecture des données locales impossible :', error)
        redirect('/recovery')
    }

    return <AuthProvider profile={profile}>{children}</AuthProvider>
}
