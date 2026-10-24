import { CreateInvoice } from '@/components/pages/invoices/CreateInvoice'
import { listClients } from '@/lib/local-store'

export default async function CreateInvoicePage() {
    return <CreateInvoice clients={await listClients()} />
}
