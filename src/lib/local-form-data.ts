import { calculateTotals, parseLines } from '@/helpers/formDataParser'

type FormPayload = Record<string, unknown>

export function readPayload(formData: FormData): FormPayload {
    const value = formData.get('payload')
    if (value === null) return {}
    try {
        const payload: unknown = JSON.parse(String(value))
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new Error('Invalid payload')
        }
        return payload as FormPayload
    } catch {
        throw new Error(
            'Les données du formulaire sont invalides. Rechargez la page puis réessayez.'
        )
    }
}

function valueOf(formData: FormData, payload: FormPayload, field: string) {
    return formData.get(field) ?? payload[field]
}

function text(
    formData: FormData,
    payload: FormPayload,
    field: string,
    fallback = ''
): string {
    const value = valueOf(formData, payload, field)
    if (value === undefined || value === null) return fallback
    if (typeof value !== 'string')
        throw new Error(`Le champ « ${field} » est invalide.`)
    return value.trim()
}

function number(
    formData: FormData,
    payload: FormPayload,
    field: string,
    fallback: number
): number {
    const value = valueOf(formData, payload, field)
    if (value === undefined || value === null || value === '') return fallback
    const parsed = Number(String(value).replace(',', '.'))
    if (!Number.isFinite(parsed))
        throw new Error(`Le champ « ${field} » doit être un nombre valide.`)
    return parsed
}

export function readId(formData: FormData, field: string) {
    const id = number(formData, {}, field, 0)
    if (!Number.isSafeInteger(id) || id <= 0)
        throw new Error(
            'Cet élément est introuvable. Revenez à la liste puis réessayez.'
        )
    return id
}

export function readClientForm(formData: FormData): Partial<Clients> {
    const payload = readPayload(formData)
    const type = text(formData, payload, 'type', 'individual')
    if (type !== 'company' && type !== 'individual')
        throw new Error('Sélectionnez un type de client valide.')
    const data: Partial<Clients> = {
        type,
        email: text(formData, payload, 'email'),
        firstname: text(formData, payload, 'firstname'),
        lastname: text(formData, payload, 'lastname'),
        company_name: text(formData, payload, 'company_name'),
        address: text(formData, payload, 'address'),
        additional_address: text(formData, payload, 'additional_address'),
        city: text(formData, payload, 'city'),
        zipcode: text(formData, payload, 'zipcode'),
        country: text(formData, payload, 'country'),
        phone: text(formData, payload, 'phone'),
        siret: text(formData, payload, 'siret'),
        naf_code: text(formData, payload, 'naf_code'),
    }
    if (
        type === 'company'
            ? !data.company_name
            : !data.firstname && !data.lastname
    ) {
        throw new Error(
            type === 'company'
                ? 'Renseignez le nom de la société.'
                : 'Renseignez le prénom ou le nom du client.'
        )
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error(
            'Renseignez une adresse e-mail valide ou laissez ce champ vide.'
        )
    }
    return data
}

export function readDocumentForm(formData: FormData) {
    const payload = readPayload(formData)
    const name = text(formData, payload, 'name')
    if (!name) throw new Error('Donnez un nom à votre document.')
    const client_id = number(formData, payload, 'client_id', 0)
    if (!Number.isSafeInteger(client_id) || client_id <= 0)
        throw new Error('Sélectionnez un client.')
    const currency = text(formData, payload, 'currency', 'EUR').toUpperCase()
    if (currency !== 'EUR')
        throw new Error(
            'Cette application utilise uniquement les montants en euros (EUR).'
        )

    // Validate numeric input before parseLines applies defaults for optional values.
    const numericFields = new Set([
        'quantity',
        'qty',
        'unit_price',
        'unit_price_eur',
        'tax_rate',
        'tax',
    ])
    const validateLineValue = (field: string, value: unknown) => {
        if (
            !numericFields.has(field) ||
            value === undefined ||
            value === null ||
            value === ''
        )
            return
        if (!Number.isFinite(Number(String(value).replace(',', '.')))) {
            throw new Error(
                'Les quantités, prix et taux de TVA doivent être des nombres valides.'
            )
        }
    }
    for (const [key, value] of formData.entries()) {
        const match = key.match(/^lines(?:\[(\d+)\]|\.(\d+))\.(.+)$/)
        if (match) validateLineValue(match[3], value)
    }
    if (payload.lines !== undefined && !Array.isArray(payload.lines))
        throw new Error('Ajoutez au moins une ligne au document.')
    for (const line of (payload.lines ?? []) as unknown[]) {
        if (!line || typeof line !== 'object' || Array.isArray(line))
            throw new Error('Une ligne du document est invalide.')
        for (const [field, value] of Object.entries(line))
            validateLineValue(field, value)
    }
    const lines = parseLines(formData, payload as QuoteFormPayload)
    if (!lines.length)
        throw new Error('Ajoutez au moins une ligne au document.')
    const vatExempt = valueOf(formData, payload, 'tva_non_applicable')
    for (const [index, line] of lines.entries()) {
        line.description = line.description.trim()
        if (vatExempt === true || vatExempt === 'true') line.tax_rate = 0
        if (!line.description)
            throw new Error(
                `Renseignez la description de la ligne ${index + 1}.`
            )
        if (!Number.isFinite(line.quantity) || line.quantity <= 0)
            throw new Error(
                `La quantité de la ligne ${index + 1} doit être positive.`
            )
        if (!Number.isFinite(line.unit_price) || line.unit_price < 0)
            throw new Error(
                `Le prix de la ligne ${index + 1} doit être positif ou nul.`
            )
        if (
            !Number.isFinite(line.tax_rate) ||
            line.tax_rate < 0 ||
            line.tax_rate > 100
        )
            throw new Error(
                `Le taux de TVA de la ligne ${index + 1} doit être compris entre 0 et 100.`
            )
        if (!Number.isSafeInteger(line.total_price))
            throw new Error(
                `Le montant de la ligne ${index + 1} est trop élevé.`
            )
    }
    const totals = calculateTotals(lines)
    if (Object.values(totals).some((value) => !Number.isSafeInteger(value)))
        throw new Error('Le montant total du document est trop élevé.')
    return {
        data: {
            client_id,
            name,
            description: text(formData, payload, 'description'),
            currency,
            terms: text(formData, payload, 'terms'),
            ...totals,
        },
        lines,
        quote: () => {
            const validity_days = number(formData, payload, 'validity_days', 30)
            if (!Number.isSafeInteger(validity_days) || validity_days < 1)
                throw new Error(
                    'La durée de validité doit être un nombre entier de jours, supérieur à zéro.'
                )
            return { validity_days }
        },
        invoice: () => {
            const interest_rate = number(formData, payload, 'interest_rate', 0)
            if (interest_rate < 0)
                throw new Error('Le taux de pénalité doit être positif ou nul.')
            return {
                payment_date: text(formData, payload, 'payment_date'),
                payment_method: text(formData, payload, 'payment_method'),
                interest_rate,
            }
        },
    }
}

export function readProfileForm(formData: FormData): Partial<Profile> {
    const capital = number(formData, {}, 'capital', 0)
    if (capital < 0)
        throw new Error('Le capital social doit être positif ou nul.')
    const profile: Partial<Profile> = {
        firstname: text(formData, {}, 'firstname'),
        lastname: text(formData, {}, 'lastname'),
        company_name: text(formData, {}, 'company_name'),
        address: text(formData, {}, 'address'),
        additional_address: text(formData, {}, 'additional_address'),
        city: text(formData, {}, 'city'),
        zipcode: text(formData, {}, 'zipcode'),
        country: text(formData, {}, 'country'),
        logo_url: text(formData, {}, 'logo_url'),
        capital,
        siret: text(formData, {}, 'siret'),
    }
    // Older account forms do not submit banking fields. Omit missing fields so
    // saving those forms preserves any banking details already stored.
    for (const field of [
        'bank_account_holder',
        'bank_name',
        'iban',
        'bic',
    ] as const) {
        if (formData.has(field)) profile[field] = text(formData, {}, field)
    }
    return profile
}
