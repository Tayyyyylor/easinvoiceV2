import { CreateQuote } from '@/components/pages/quotes/CreateQuote'
import { listClients } from '@/lib/local-store'

export default async function CreateQuotePage() {
    return <CreateQuote clients={await listClients()} />
}
