import { constants } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

export type DocumentType = 'quote' | 'invoice'
export type DocumentFor<T extends DocumentType> = T extends 'quote'
    ? Quotes
    : Invoices
export type ItemsFor<T extends DocumentType> = T extends 'quote'
    ? QuoteItems
    : InvoiceItems
type StoredQuote = Quotes & { items: QuoteItems[] }
type StoredInvoice = Invoices & { items: InvoiceItems[] }
type LineInput = {
    description: string
    type?: string
    quantity: number
    unit_price: number
    tax_rate: number
    total_price: number
}

export interface LocalDatabase {
    version: 1
    profile: Profile
    clients: Clients[]
    quotes: StoredQuote[]
    invoices: StoredInvoice[]
    nextIds: { client: number; quote: number; invoice: number; item: number }
    numberCounters: Record<DocumentType, Record<string, number>>
}

const profileStrings = [
    'firstname',
    'lastname',
    'company_name',
    'address',
    'additional_address',
    'city',
    'zipcode',
    'country',
    'siret',
] as const
const clientStrings = [...profileStrings, 'email', 'naf_code', 'phone'] as const
const MAX_LOGO_BYTES = 2 * 1024 * 1024

function paths() {
    const directory = path.resolve(
        process.env.EASINVOICE_DATA_DIR || path.join(process.cwd(), '.data')
    )
    return {
        directory,
        file: path.join(directory, 'easinvoice.json'),
        lock: path.join(directory, 'easinvoice.lock'),
    }
}

function fail(message: string): never {
    throw new Error(message)
}

function record(value: unknown, label: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        fail(`${label} : objet attendu.`)
    }
    return value as Record<string, unknown>
}

function text(value: unknown, label: string, max = 20_000): string {
    if (typeof value !== 'string' || value.length > max) {
        fail(`${label} : texte invalide.`)
    }
    return value
}

function number(
    value: unknown,
    label: string,
    min = 0,
    max = Number.MAX_SAFE_INTEGER
): number {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < min ||
        value > max
    ) {
        fail(`${label} : nombre invalide.`)
    }
    return value
}

function integer(value: unknown, label: string, min = 0): number {
    const result = number(value, label, min)
    if (!Number.isSafeInteger(result)) fail(`${label} : entier attendu.`)
    return result
}

function logo(value: unknown): string {
    const result = text(value, 'Logo', Math.ceil(MAX_LOGO_BYTES / 3) * 4 + 100)
    if (!result) return ''
    const match =
        /^data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(
            result
        )
    if (!match || match[1].length % 4 !== 0)
        fail('Logo : image PNG, JPEG ou WEBP encodée en base64 attendue.')
    const bytes = Buffer.from(match[1], 'base64')
    if (bytes.length > MAX_LOGO_BYTES)
        fail('Le logo doit faire au maximum 2 Mo.')
    if (bytes.toString('base64') !== match[1])
        fail('Logo : encodage base64 invalide.')
    const png = bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    const jpeg =
        bytes.length >= 3 &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
    const webp =
        bytes.length >= 12 &&
        bytes.toString('ascii', 0, 4) === 'RIFF' &&
        bytes.toString('ascii', 8, 12) === 'WEBP'
    if (
        !(result.startsWith('data:image/png;')
            ? png
            : result.startsWith('data:image/jpeg;')
              ? jpeg
              : webp)
    ) {
        fail('Logo : le contenu ne correspond pas au format de l’image.')
    }
    return result
}

function bankText(value: unknown, label: string, max: number): string {
    const result = text(value === undefined ? '' : value, label).trim()
    if (result.length > max)
        fail(`${label} : utilisez au maximum ${max} caractères.`)
    return result
}

function bankIdentifier(value: unknown, label: string, max: number): string {
    const result = text(value === undefined ? '' : value, label)
        .replace(/\s/g, '')
        .toUpperCase()
    if (result.length > max)
        fail(`${label} : utilisez au maximum ${max} caractères, hors espaces.`)
    if (result && !/^[A-Z0-9]+$/.test(result))
        fail(
            `${label} : utilisez uniquement des lettres et des chiffres, sans tirets ni ponctuation.`
        )
    return result
}

function blankProfile(): Profile {
    return {
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
        bank_account_holder: '',
        bank_name: '',
        iban: '',
        bic: '',
    }
}

function emptyDatabase(): LocalDatabase {
    return {
        version: 1,
        profile: blankProfile(),
        clients: [],
        quotes: [],
        invoices: [],
        nextIds: { client: 1, quote: 1, invoice: 1, item: 1 },
        numberCounters: { quote: {}, invoice: {} },
    }
}

function validateProfile(input: unknown): Profile {
    const source = record(input, 'Profil')
    const result = blankProfile()
    for (const key of profileStrings)
        result[key] = text(source[key], `Profil ${key}`)
    result.capital = number(source.capital, 'Capital', 0, 1_000_000_000_000)
    result.logo_url = source.logo_url === undefined ? '' : logo(source.logo_url)
    result.bank_account_holder = bankText(
        source.bank_account_holder,
        'Titulaire du compte',
        200
    )
    result.bank_name = bankText(source.bank_name, 'Nom de la banque', 200)
    result.iban = bankIdentifier(source.iban, 'IBAN', 34)
    result.bic = bankIdentifier(source.bic, 'BIC', 11)
    return result
}

function validateClient(input: unknown): Clients {
    const source = record(input, 'Client')
    const result = {
        id: integer(source.id, 'Identifiant client', 1),
    } as Clients
    for (const key of clientStrings)
        result[key] = text(source[key], `Client ${key}`)
    result.capital = number(
        source.capital,
        'Capital client',
        0,
        1_000_000_000_000
    )
    result.tva = number(source.tva, 'TVA client', 0, 100)
    if (source.type !== 'company' && source.type !== 'individual')
        fail('Type de client invalide.')
    result.type = source.type
    if (
        ![result.firstname, result.lastname, result.company_name].some(
            (value) => value.trim()
        )
    ) {
        fail('Le client doit avoir un nom ou une raison sociale.')
    }
    return result
}

function roundedDecimalProduct(
    value: number,
    multiplier: number,
    divisor = 1
): number {
    // Read the decimal value rather than multiplying IEEE floats: 1.005 × 100
    // must round to 101, and large exact integer amounts must stay unchanged.
    const [coefficient, exponent = '0'] = value.toString().split('e')
    const fractionLength = coefficient.split('.')[1]?.length ?? 0
    const power = Number(exponent) - fractionLength
    let numerator = BigInt(coefficient.replace('.', '')) * BigInt(multiplier)
    let denominator = BigInt(divisor)
    if (power >= 0) numerator *= BigInt(10) ** BigInt(power)
    else denominator *= BigInt(10) ** BigInt(-power)
    return integer(
        Number(
            (numerator * BigInt(2) + denominator) / (denominator * BigInt(2))
        ),
        'Montant en centimes'
    )
}

function normalizeLine(input: unknown): Omit<Items, 'id'> {
    const source = record(input, 'Ligne')
    const description = text(source.description, 'Description de ligne').trim()
    if (!description) fail('Chaque ligne doit avoir une description.')
    const quantity = number(
        source.quantity,
        'Quantité',
        Number.MIN_VALUE,
        1_000_000
    )
    const unitPriceCents = integer(
        roundedDecimalProduct(
            number(source.unit_price, 'Prix unitaire', 0, 1_000_000_000),
            100
        ),
        'Prix unitaire en centimes'
    )
    const taxRate = number(source.tax_rate, 'TVA', 0, 100)
    const totalPrice = integer(
        roundedDecimalProduct(quantity, unitPriceCents),
        'Total de ligne'
    )
    return {
        description,
        type:
            source.type === undefined
                ? 'service'
                : text(source.type, 'Type de ligne', 100),
        quantity,
        unit_price: unitPriceCents / 100,
        tax_rate: taxRate,
        total_price: totalPrice,
    }
}

function totals(items: Items[]) {
    const subtotal_cents = integer(
        items.reduce((sum, item) => sum + item.total_price, 0),
        'Total HT'
    )
    const tax_cents = integer(
        items.reduce(
            (sum, item) =>
                sum +
                roundedDecimalProduct(item.tax_rate, item.total_price, 100),
            0
        ),
        'Total TVA'
    )
    return {
        subtotal_cents,
        tax_cents,
        total_cents: integer(subtotal_cents + tax_cents, 'Total TTC'),
    }
}

function validateTheme(input: unknown): BaseDocument['pdf_overrides'] {
    if (input === null || input === undefined) return {}
    const source = record(input, 'Thème PDF')
    const result: { primaryColor?: string; hideTax?: boolean } = {}
    if (source.primaryColor !== undefined) {
        const color = text(source.primaryColor, 'Couleur PDF', 7)
        if (!/^#[0-9a-f]{6}$/i.test(color)) fail('Couleur PDF invalide.')
        result.primaryColor = color
    }
    if (source.hideTax !== undefined) {
        if (typeof source.hideTax !== 'boolean')
            fail('Option TVA du PDF invalide.')
        result.hideTax = source.hideTax
    }
    return result
}

function documentFields(type: DocumentType, input: unknown) {
    const source = record(input, 'Document')
    const client_id = integer(source.client_id, 'Client du document', 1)
    const currency = text(source.currency, 'Devise', 3).toUpperCase()
    if (currency !== 'EUR') fail('Seule la devise EUR est prise en charge.')
    const common = {
        client_id,
        name: text(source.name, 'Nom du document', 500),
        description: text(source.description, 'Description du document'),
        currency,
        terms: text(source.terms, 'Conditions du document'),
        pdf_overrides: validateTheme(source.pdf_overrides),
    }
    if (type === 'quote') {
        const validity_days = integer(source.validity_days, 'Durée de validité')
        if (validity_days > 36_500) fail('Durée de validité trop longue.')
        return { ...common, validity_days }
    }
    return {
        ...common,
        payment_date: text(source.payment_date, 'Échéance de paiement', 500),
        payment_method: text(source.payment_method, 'Mode de paiement', 500),
        interest_rate: number(source.interest_rate, "Taux d'intérêt", 0, 100),
    }
}

function array(input: unknown, label: string): unknown[] {
    if (!Array.isArray(input) || input.length > 100_000)
        fail(`${label} : liste invalide.`)
    return input
}

function timestamp(input: unknown, label: string): string {
    const value = text(input, label, 50)
    if (
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString() !== value
    )
        fail(`${label} invalide.`)
    return value
}

function validateDatabase(input: unknown): LocalDatabase {
    const source = record(input, 'Sauvegarde')
    if (source.version !== 1)
        fail('Version de sauvegarde non prise en charge (version 1 attendue).')
    const result = emptyDatabase()
    result.profile = validateProfile(source.profile)
    result.clients = array(source.clients, 'Clients').map(validateClient)
    const clientIds = new Set(result.clients.map((client) => client.id))
    if (clientIds.size !== result.clients.length)
        fail('Identifiants clients dupliqués.')
    const allItemIds = new Set<number>()
    const maxima = {
        client: result.clients.reduce(
            (maximum, client) => Math.max(maximum, client.id),
            0
        ),
        quote: 0,
        invoice: 0,
        item: 0,
    }
    const observedCounters: Record<DocumentType, Record<string, number>> = {
        quote: {},
        invoice: {},
    }

    for (const type of ['quote', 'invoice'] as const) {
        const documents = array(
            source[type === 'quote' ? 'quotes' : 'invoices'],
            'Documents'
        )
        const ids = new Set<number>()
        const numbers = new Set<string>()
        const normalized = documents.map((input) => {
            const document = record(input, 'Document')
            const id = integer(document.id, 'Identifiant document', 1)
            if (ids.has(id)) fail('Identifiants documents dupliqués.')
            ids.add(id)
            maxima[type] = Math.max(maxima[type], id)
            const fields = documentFields(type, document)
            if (!clientIds.has(fields.client_id))
                fail(
                    `Client ${fields.client_id} introuvable pour le document ${id}.`
                )
            const created_at = timestamp(
                document.created_at,
                'Date de création'
            )
            if (document.status !== 'draft' && document.status !== 'published')
                fail('Statut de document invalide.')
            const formatted_no = text(
                document.formatted_no,
                'Numéro de document',
                50
            )
            if (document.status === 'published') {
                const match = new RegExp(
                    `^${type === 'quote' ? 'D' : 'F'}(\\d{4})(\\d{4,})$`
                ).exec(formatted_no)
                if (!match || Number(match[2]) < 1 || numbers.has(formatted_no))
                    fail('Numéro de document publié invalide ou dupliqué.')
                const sequence = integer(
                    Number(match[2]),
                    'Séquence de numérotation',
                    1
                )
                if (
                    formatted_no !==
                    `${type === 'quote' ? 'D' : 'F'}${match[1]}${String(sequence).padStart(4, '0')}`
                )
                    fail('Format du numéro de document invalide.')
                numbers.add(formatted_no)
                observedCounters[type][match[1]] = Math.max(
                    observedCounters[type][match[1]] ?? 0,
                    sequence
                )
            } else if (formatted_no !== '')
                fail('Un brouillon ne peut pas porter un numéro définitif.')
            const lineInputs = array(document.items, 'Lignes')
            if (!lineInputs.length)
                fail('Un document doit contenir au moins une ligne.')
            const parentKey = type === 'quote' ? 'quote_id' : 'invoice_id'
            const items = lineInputs.map((lineInput) => {
                const line = record(lineInput, 'Ligne')
                const itemId = integer(line.id, 'Identifiant ligne', 1)
                if (allItemIds.has(itemId))
                    fail('Identifiants de lignes dupliqués.')
                allItemIds.add(itemId)
                maxima.item = Math.max(maxima.item, itemId)
                if (line[parentKey] !== id)
                    fail('Référence de document incorrecte sur une ligne.')
                const normalized = normalizeLine(line)
                if (
                    line.total_price !== normalized.total_price ||
                    line.unit_price !== normalized.unit_price
                )
                    fail('Montant de ligne incohérent dans la sauvegarde.')
                return { ...normalized, id: itemId, [parentKey]: id }
            })
            const calculated = totals(items)
            for (const key of [
                'subtotal_cents',
                'tax_cents',
                'total_cents',
            ] as const) {
                if (document[key] !== calculated[key])
                    fail('Totaux incohérents dans la sauvegarde.')
            }
            const historical: Pick<
                BaseDocument,
                'finalized_at' | 'emitter_snapshot' | 'client_snapshot'
            > = {}
            if (document.finalized_at !== undefined)
                historical.finalized_at = timestamp(
                    document.finalized_at,
                    'Date de finalisation'
                )
            if (document.emitter_snapshot !== undefined)
                historical.emitter_snapshot = validateProfile(
                    document.emitter_snapshot
                )
            if (document.client_snapshot !== undefined) {
                historical.client_snapshot = validateClient(
                    document.client_snapshot
                )
                if (historical.client_snapshot.id !== fields.client_id)
                    fail(
                        'Le client figé du document ne correspond pas à sa référence.'
                    )
            }
            if (document.status === 'draft' && Object.keys(historical).length)
                fail(
                    'Un brouillon ne peut pas contenir de données de finalisation.'
                )
            if (historical.finalized_at && historical.finalized_at < created_at)
                fail(
                    'La finalisation ne peut pas précéder la création du document.'
                )
            if (document.status === 'published') {
                // Backups produced before snapshots existed remain usable and
                // acquire fixed historical identities on their next save.
                historical.emitter_snapshot ??= structuredClone(result.profile)
                historical.client_snapshot ??= structuredClone(
                    result.clients.find(
                        (client) => client.id === fields.client_id
                    )!
                )
            }
            return {
                ...fields,
                ...historical,
                id,
                created_at,
                status: document.status,
                formatted_no,
                ...calculated,
                items,
            }
        })
        if (type === 'quote') result.quotes = normalized as StoredQuote[]
        else result.invoices = normalized as StoredInvoice[]
    }

    const nextIds = record(source.nextIds, 'Compteurs des identifiants')
    for (const key of ['client', 'quote', 'invoice', 'item'] as const) {
        result.nextIds[key] = integer(
            nextIds[key],
            `Prochain identifiant ${key}`,
            1
        )
        if (result.nextIds[key] <= maxima[key])
            fail(`Compteur d'identifiant ${key} incohérent.`)
    }
    const counters = record(source.numberCounters, 'Compteurs de numérotation')
    for (const type of ['quote', 'invoice'] as const) {
        const years = record(counters[type], 'Compteurs annuels')
        for (const [year, value] of Object.entries(years)) {
            if (!/^\d{4}$/.test(year)) fail('Année de numérotation invalide.')
            result.numberCounters[type][year] = integer(
                value,
                'Compteur annuel'
            )
        }
        for (const [year, maximum] of Object.entries(observedCounters[type])) {
            if ((result.numberCounters[type][year] ?? 0) < maximum)
                fail(
                    'Compteur de numérotation inférieur aux documents existants.'
                )
        }
    }
    return result
}

function isError(error: unknown, code: string): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === code
    )
}

async function readDatabase(): Promise<LocalDatabase> {
    const { file } = paths()
    let content: string
    try {
        content = await fs.readFile(file, 'utf8')
    } catch (error) {
        if (isError(error, 'ENOENT')) return emptyDatabase()
        throw error
    }
    try {
        return validateDatabase(JSON.parse(content))
    } catch (error) {
        fail(
            `Le fichier de données ${file} est illisible ou invalide. Il a été conservé. ${error instanceof Error ? error.message : ''}`
        )
    }
}

function processAlive(pid: number) {
    try {
        process.kill(pid, 0)
        return true
    } catch (error) {
        return !isError(error, 'ESRCH')
    }
}

type LockTicket = { choosing: boolean; ticket: number }

async function peerTickets(
    lock: string,
    ownName: string
): Promise<Array<LockTicket & { name: string }>> {
    const peers: Array<LockTicket & { name: string }> = []
    for (const name of await fs.readdir(lock)) {
        if (name === ownName) continue
        const match = /^(\d+)-[0-9a-f-]+\.json$/.exec(name)
        if (!match) continue
        const filename = path.join(lock, name)
        // Each operation has a unique filename; stale cleanup cannot unlink
        // another writer's newly acquired lock, including after a crash.
        if (!processAlive(Number(match[1]))) {
            await fs.unlink(filename).catch((error) => {
                if (!isError(error, 'ENOENT')) throw error
            })
            continue
        }
        try {
            const ticket = JSON.parse(
                await fs.readFile(filename, 'utf8')
            ) as LockTicket
            if (
                typeof ticket.choosing !== 'boolean' ||
                !Number.isSafeInteger(ticket.ticket) ||
                ticket.ticket < 0
            ) {
                peers.push({ name, choosing: true, ticket: 0 })
            } else peers.push({ name, ...ticket })
        } catch (error) {
            if (isError(error, 'ENOENT')) continue
            // A peer may still be writing its initial choosing marker.
            if (error instanceof SyntaxError)
                peers.push({ name, choosing: true, ticket: 0 })
            else throw error
        }
    }
    return peers
}

async function withLock<T>(operation: () => Promise<T>): Promise<T> {
    const { directory, lock } = paths()
    await fs.mkdir(directory, { recursive: true, mode: 0o700 })
    await fs.mkdir(lock, { recursive: true, mode: 0o700 })
    const name = `${process.pid}-${randomUUID()}.json`
    const marker = path.join(lock, name)
    const temporary = path.join(lock, `.${name}.tmp`)
    const deadline = Date.now() + 30_000
    try {
        // Lamport's bakery protocol serializes independent Next workers. A
        // choosing marker precedes ticket selection; atomic rename publishes
        // that ticket. The shared directory is never removed or replaced.
        await fs.writeFile(
            marker,
            JSON.stringify({ choosing: true, ticket: 0 }),
            { flag: 'wx', mode: 0o600 }
        )
        const peers = await peerTickets(lock, name)
        const ticket = integer(
            peers.reduce((maximum, peer) => Math.max(maximum, peer.ticket), 0) +
                1,
            'Ticket du verrou',
            1
        )
        await fs.writeFile(
            temporary,
            JSON.stringify({ choosing: false, ticket }),
            { flag: 'wx', mode: 0o600 }
        )
        await fs.rename(temporary, marker)
        for (;;) {
            const waiting = (await peerTickets(lock, name)).some(
                (peer) =>
                    peer.choosing ||
                    peer.ticket < ticket ||
                    (peer.ticket === ticket && peer.name < name)
            )
            if (!waiting) break
            if (Date.now() > deadline)
                fail(
                    `Le stockage local est occupé (${lock}). Réessayez dans quelques instants.`
                )
            await new Promise((resolve) =>
                setTimeout(resolve, 15 + Math.random() * 30)
            )
        }
        return await operation()
    } finally {
        await fs.unlink(marker).catch((error) => {
            if (!isError(error, 'ENOENT')) throw error
        })
        await fs.unlink(temporary).catch((error) => {
            if (!isError(error, 'ENOENT')) throw error
        })
    }
}

async function writeDatabase(database: LocalDatabase): Promise<void> {
    const { file, directory } = paths()
    const temporary = path.join(directory, `.easinvoice-${randomUUID()}.tmp`)
    try {
        const handle = await fs.open(temporary, 'wx', 0o600)
        try {
            await handle.writeFile(JSON.stringify(database, null, 2) + '\n')
            await handle.sync()
        } finally {
            await handle.close()
        }
        await fs.rename(temporary, file)
        const folder = await fs.open(directory, 'r')
        try {
            await folder.sync()
        } finally {
            await folder.close()
        }
    } finally {
        await fs.unlink(temporary).catch(() => {})
    }
}

async function transaction<T>(
    operation: (database: LocalDatabase) => T
): Promise<T> {
    return withLock(async () => {
        const database = await readDatabase()
        const result = operation(database)
        // Catch invalid mutations before replacing the only current database.
        const checked = validateDatabase(database)
        await writeDatabase(checked)
        return structuredClone(result)
    })
}

export async function getProfile(): Promise<Profile> {
    return (await readDatabase()).profile
}

export async function saveProfile(data: Partial<Profile>): Promise<Profile> {
    return transaction((database) => {
        database.profile = validateProfile({
            ...database.profile,
            ...record(data, 'Profil'),
        })
        return database.profile
    })
}

export async function listClients(): Promise<Clients[]> {
    return (await readDatabase()).clients
}

export async function getClient(id: number): Promise<Clients | null> {
    integer(id, 'Identifiant client', 1)
    return (
        (await readDatabase()).clients.find((client) => client.id === id) ??
        null
    )
}

export async function saveClient(
    data: Partial<Clients>,
    id?: number
): Promise<Clients> {
    return transaction((database) => {
        if (id !== undefined) integer(id, 'Identifiant client', 1)
        const existing =
            id === undefined
                ? undefined
                : database.clients.find((client) => client.id === id)
        if (id !== undefined && !existing) fail('Client introuvable.')
        const client = validateClient({
            ...blankProfile(),
            email: '',
            naf_code: '',
            phone: '',
            tva: 20,
            type: 'company',
            ...existing,
            ...record(data, 'Client'),
            id: id ?? database.nextIds.client++,
        })
        if (existing)
            database.clients[database.clients.indexOf(existing)] = client
        else database.clients.push(client)
        return client
    })
}

function collection(
    database: LocalDatabase,
    type: DocumentType
): Array<StoredQuote | StoredInvoice> {
    if (type !== 'quote' && type !== 'invoice')
        fail('Type de document invalide.')
    return type === 'quote' ? database.quotes : database.invoices
}

export async function listDocuments<T extends DocumentType>(
    type: T
): Promise<DocumentFor<T>[]> {
    return collection(await readDatabase(), type).map((document) => {
        const { items, ...fields } = document
        void items
        return fields as DocumentFor<T>
    })
}

export async function getDocument<T extends DocumentType>(
    type: T,
    id: number
): Promise<(DocumentFor<T> & { items: ItemsFor<T>[] }) | null> {
    integer(id, 'Identifiant document', 1)
    return (collection(await readDatabase(), type).find(
        (document) => document.id === id
    ) ?? null) as (DocumentFor<T> & { items: ItemsFor<T>[] }) | null
}

export async function saveDocument<T extends DocumentType>(
    type: T,
    data: Partial<DocumentFor<T>>,
    lines: LineInput[],
    id?: number
): Promise<DocumentFor<T>> {
    return transaction((database) => {
        const documents = collection(database, type)
        if (id !== undefined) integer(id, 'Identifiant document', 1)
        const existing =
            id === undefined
                ? undefined
                : documents.find((document) => document.id === id)
        if (id !== undefined && !existing) fail('Document introuvable.')
        if (existing?.status === 'published')
            fail('Un document finalisé ne peut plus être modifié.')
        const documentId = id ?? database.nextIds[type]++
        const fields = documentFields(type, {
            name: '',
            description: '',
            currency: 'EUR',
            terms: '',
            pdf_overrides: null,
            validity_days: 30,
            payment_date: '',
            payment_method: 'Virement bancaire',
            interest_rate: 0,
            ...existing,
            ...record(data, 'Document'),
        })
        if (!database.clients.some((client) => client.id === fields.client_id))
            fail('Le client sélectionné est introuvable.')
        const lineInputs = array(lines, 'Lignes')
        if (!lineInputs.length) fail('Ajoutez au moins une ligne au document.')
        const items = lineInputs.map((line) => ({
            ...normalizeLine(line),
            id: database.nextIds.item++,
            [type === 'quote' ? 'quote_id' : 'invoice_id']: documentId,
        }))
        const document = {
            ...fields,
            id: documentId,
            status: 'draft' as const,
            created_at: existing?.created_at ?? new Date().toISOString(),
            formatted_no: '',
            ...totals(items),
            items,
        } as StoredQuote | StoredInvoice
        if (existing) documents[documents.indexOf(existing)] = document
        else documents.push(document)
        const { items: savedItems, ...saved } = document
        void savedItems
        return saved as DocumentFor<T>
    })
}

export async function finalizeDocument<T extends DocumentType>(
    type: T,
    id: number
): Promise<DocumentFor<T>> {
    return transaction((database) => {
        integer(id, 'Identifiant document', 1)
        const document = collection(database, type).find(
            (document) => document.id === id
        )
        if (!document) fail('Document introuvable.')
        if (document.status !== 'published') {
            const year = new Intl.DateTimeFormat('fr-FR', {
                year: 'numeric',
                timeZone: 'Europe/Paris',
            }).format(new Date())
            const sequence = integer(
                (database.numberCounters[type][year] ?? 0) + 1,
                'Numéro de document',
                1
            )
            const counters: Record<string, number> =
                database.numberCounters[type]
            counters[year] = sequence
            document.status = 'published'
            document.formatted_no = `${type === 'quote' ? 'D' : 'F'}${year}${String(sequence).padStart(4, '0')}`
            document.finalized_at = new Date().toISOString()
            document.emitter_snapshot = structuredClone(database.profile)
            document.client_snapshot = structuredClone(
                database.clients.find(
                    (client) => client.id === document.client_id
                )!
            )
        }
        const { items, ...saved } = document
        void items
        return saved as DocumentFor<T>
    })
}

export async function exportDatabase(): Promise<LocalDatabase> {
    return readDatabase()
}

export async function importDatabase(input: unknown): Promise<void> {
    const replacement = validateDatabase(input)
    await withLock(async () => {
        const { file, directory } = paths()
        try {
            const original = await fs.readFile(file, 'utf8')
            const backup = path.join(
                directory,
                `easinvoice.before-import-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}.json`
            )
            await fs.copyFile(file, backup, constants.COPYFILE_EXCL)
            const handle = await fs.open(backup, 'r')
            try {
                await handle.sync()
            } finally {
                await handle.close()
            }
            let current: LocalDatabase | undefined
            try {
                current = validateDatabase(JSON.parse(original))
            } catch {
                /* Keep corrupt bytes backed up, then restore. */
            }
            if (current) {
                // An older backup must not reissue already published numbers.
                for (const type of ['quote', 'invoice'] as const) {
                    for (const [year, sequence] of Object.entries(
                        current.numberCounters[type]
                    )) {
                        replacement.numberCounters[type][year] = Math.max(
                            replacement.numberCounters[type][year] ?? 0,
                            sequence
                        )
                    }
                }
                for (const key of [
                    'client',
                    'quote',
                    'invoice',
                    'item',
                ] as const) {
                    replacement.nextIds[key] = Math.max(
                        replacement.nextIds[key],
                        current.nextIds[key]
                    )
                }
            }
        } catch (error) {
            if (!isError(error, 'ENOENT')) throw error
        }
        // An explicit restore may replace an unreadable current file. Its exact
        // bytes are preserved above, including if that old file is corrupt.
        await writeDatabase(replacement)
    })
}
