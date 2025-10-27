interface Profile {
    firstname: string
    lastname: string
    company_name: string
    address: string
    additional_address: string
    city: string
    zipcode: string
    country: string
    capital: number
    siret: string
    logo_url?: string
}
interface Clients {
    id: number
    firstname: string
    lastname: string
    company_name: string
    email: string
    address: string
    additional_address: string
    city: string
    zipcode: string
    country: string
    capital: number
    naf_code: string
    siret: string
    phone: string
    tva: number
    type: string
}

type ClientFormPayload = Partial<Clients>

interface BaseDocument {
    id: number
    status: 'draft' | 'published'
    name: string
    description: string
    client_id: number
    currency: string
    subtotal_cents: number
    tax_cents: number
    total_cents: number
    terms: string
    created_at: string
    pdf_overrides: React.Node
    formatted_no: string
}

interface Quotes extends BaseDocument {
    validity_days: number
}

interface Invoices extends BaseDocument {
    payment_date: string
    payment_method: string
    interest_rate: number
}

interface Items {
    id: number
    description: string
    type: string
    quantity: number
    unit_price: number
    tax_rate: number
    total_price: number
}

interface InvoiceItems extends Items {
    invoice_id: number
}

interface QuoteItems extends Items {
    quote_id: number
}

type QuoteFormPayload = Partial<Quotes> & {
    lines?: Array<Partial<Items>>
}

type InvoiceFormPayload = Partial<Invoices> & {
    lines?: Array<Partial<Items>>
}
