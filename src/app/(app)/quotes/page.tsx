import { Quotes } from '@/components/pages/quotes/Quotes'
import { listDocuments } from '@/lib/local-store'

export default async function QuotesPage() {
    return <Quotes quotes={await listDocuments('quote')} />
}
