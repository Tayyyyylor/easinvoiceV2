import { Clients } from '@/components/pages/clients/Clients'
import { listClients } from '@/lib/local-store'

export default async function ClientsPage() {
    return <Clients clients={await listClients()} />
}
