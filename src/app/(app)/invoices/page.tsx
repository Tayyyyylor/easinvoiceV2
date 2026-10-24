import { Invoices } from '@/components/pages/invoices/Invoices'
import { listDocuments } from '@/lib/local-store'

export default async function InvoicesPage() {
    return <Invoices invoices={await listDocuments('invoice')} />
}
