import { Settings } from '@/components/pages/Settings'
import { AuthProvider } from '@/contexts/useAuth'

const emptyProfile: Profile = {
    firstname: '',
    lastname: '',
    company_name: '',
    address: '',
    additional_address: '',
    city: '',
    zipcode: '',
    country: 'France',
    capital: 0,
    siret: '',
    logo_url: '',
}

export default function RecoveryPage() {
    return (
        <AuthProvider profile={emptyProfile}>
            <Settings recovery />
        </AuthProvider>
    )
}
