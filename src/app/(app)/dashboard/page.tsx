import Dashboard from '@/components/pages/Dashboard'
import { listClients, listDocuments } from '@/lib/local-store'

export default async function DashboardPage() {
    const [clients, quotes, invoices] = await Promise.all([
        listClients(),
        listDocuments('quote'),
        listDocuments('invoice'),
    ])

    return <Dashboard clients={clients} quotes={quotes} invoices={invoices} />
}
