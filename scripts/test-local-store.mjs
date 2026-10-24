import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import * as store from '../src/lib/local-store.ts'

const storeUrl = new URL('../src/lib/local-store.ts', import.meta.url).href
const png =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZioAAAAASUVORK5CYII='
const bankDetails = {
    bank_account_holder: 'Atelier local',
    bank_name: 'Banque de test',
    iban: 'FR7630006000011234567890189',
    bic: 'AGRIFRPPXXX',
}
const bankFields = Object.keys(bankDetails)
const onlyBankDetails = (profile) =>
    Object.fromEntries(bankFields.map((field) => [field, profile[field]]))
const emptyBankDetails = Object.fromEntries(
    bankFields.map((field) => [field, ''])
)
const line = {
    description: 'Prestation',
    quantity: 1.5,
    unit_price: 19.99,
    tax_rate: 20,
    total_price: 999_999,
}

function worker(code, directory) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            process.execPath,
            [
                '--input-type=module',
                '--eval',
                `import * as store from ${JSON.stringify(storeUrl)}; ${code}`,
            ],
            {
                cwd: fileURLToPath(new URL('..', import.meta.url)),
                env: { ...process.env, EASINVOICE_DATA_DIR: directory },
                stdio: ['ignore', 'pipe', 'pipe'],
            }
        )
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', (chunk) => {
            stdout += chunk
        })
        child.stderr.on('data', (chunk) => {
            stderr += chunk
        })
        child.on('error', reject)
        child.on('close', (code) =>
            code === 0
                ? resolve({ stdout, pid: child.pid })
                : reject(new Error(`Worker exited ${code}: ${stderr}`))
        )
    })
}

test('local repository: durable CRUD, cents, numbering, backups and recovery', async (t) => {
    const directory = await fs.mkdtemp(
        path.join(os.tmpdir(), 'easinvoice-store-')
    )
    const previousDirectory = process.env.EASINVOICE_DATA_DIR
    process.env.EASINVOICE_DATA_DIR = directory
    const file = path.join(directory, 'easinvoice.json')
    let client
    let quote
    let invoice
    try {
        await t.test(
            'starts blank and persists profile, embedded logo and clients',
            async () => {
                assert.equal((await store.getProfile()).country, 'France')
                assert.equal((await store.getProfile()).company_name, '')
                assert.deepEqual(
                    onlyBankDetails(await store.getProfile()),
                    emptyBankDetails
                )
                assert.deepEqual(await store.listClients(), [])
                await store.saveProfile({
                    company_name: 'Atelier local',
                    logo_url: png,
                    capital: 100,
                })
                client = await store.saveClient({
                    company_name: 'Client principal',
                    email: 'client@example.test',
                    ...bankDetails,
                })
                assert.equal(client.id, 1)
                assert.equal(client.country, 'France')
                assert.equal(
                    (await store.getClient(1)).email,
                    'client@example.test'
                )
                assert.equal(await store.getClient(404), null)
                client = await store.saveClient(
                    { city: 'Paris', id: 555 },
                    client.id
                )
                assert.equal(client.id, 1)
                assert.equal(client.company_name, 'Client principal')
                assert.equal(client.city, 'Paris')
                const second = await store.saveClient({
                    firstname: 'Camille',
                    lastname: 'Martin',
                    type: 'individual',
                })
                assert.equal(second.id, 2)
                const persisted = JSON.parse(await fs.readFile(file, 'utf8'))
                assert.equal(persisted.profile.logo_url, png)
                assert.equal(persisted.clients.length, 2)
                assert.ok(
                    persisted.clients.every((entry) =>
                        bankFields.every(
                            (field) => !Object.hasOwn(entry, field)
                        )
                    )
                )
            }
        )

        await t.test(
            'normalizes optional bank details, preserves partial updates and permits clearing fields',
            async () => {
                await store.saveProfile({
                    bank_account_holder: '  Atelier local  ',
                    bank_name: '  Banque de test  ',
                    iban: 'fr76 3000 6000 0112 3456 7890 189',
                    bic: 'agri fr pp xxx',
                })
                assert.deepEqual(
                    onlyBankDetails(await store.getProfile()),
                    bankDetails
                )
                await store.saveProfile({ city: 'Nantes' })
                assert.deepEqual(
                    onlyBankDetails(await store.getProfile()),
                    bankDetails
                )
                await store.saveProfile({ iban: '' })
                assert.equal((await store.getProfile()).iban, '')
                await store.saveProfile({
                    ...emptyBankDetails,
                    iban: bankDetails.iban,
                })
                assert.deepEqual(onlyBankDetails(await store.getProfile()), {
                    ...emptyBankDetails,
                    iban: bankDetails.iban,
                })
                await store.saveProfile(bankDetails)
                const persisted = JSON.parse(await fs.readFile(file, 'utf8'))
                assert.deepEqual(
                    onlyBankDetails(persisted.profile),
                    bankDetails
                )

                const before = await fs.readFile(file, 'utf8')
                for (const [data, error] of [
                    [{ iban: 'FR76-3000' }, /IBAN.*lettres et des chiffres/],
                    [{ bic: 'AGRI/FRPP' }, /BIC.*lettres et des chiffres/],
                    [{ iban: 'A'.repeat(35) }, /IBAN.*34 caractères/],
                    [{ bic: 'A'.repeat(12) }, /BIC.*11 caractères/],
                    [
                        { bank_account_holder: 'A'.repeat(201) },
                        /Titulaire.*200 caractères/,
                    ],
                    [{ bank_name: 'A'.repeat(201) }, /banque.*200 caractères/],
                    [{ iban: null }, /IBAN/],
                ]) {
                    await assert.rejects(() => store.saveProfile(data), error)
                }
                assert.equal(await fs.readFile(file, 'utf8'), before)
            }
        )

        await t.test(
            'recalculates every line and aggregate total on the server',
            async () => {
                quote = await store.saveDocument(
                    'quote',
                    {
                        client_id: client.id,
                        name: 'Site internet',
                        subtotal_cents: 1,
                        tax_cents: 2,
                        total_cents: 3,
                        status: 'published',
                        formatted_no: 'FAKE',
                    },
                    [
                        line,
                        {
                            ...line,
                            description: 'Petit matériel',
                            quantity: 3,
                            unit_price: 0.1,
                            tax_rate: 10,
                        },
                    ]
                )
                assert.equal(quote.id, 1)
                assert.equal(quote.status, 'draft')
                assert.equal(quote.formatted_no, '')
                assert.equal(quote.subtotal_cents, 3029)
                assert.equal(quote.tax_cents, 603)
                assert.equal(quote.total_cents, 3632)
                const detail = await store.getDocument('quote', quote.id)
                assert.equal(detail.items[0].quote_id, quote.id)
                assert.equal(detail.items[0].total_price, 2999)
                assert.equal(detail.items[0].unit_price, 19.99)
                assert.equal(
                    (await store.listDocuments('quote'))[0].items,
                    undefined
                )
                assert.equal(await store.getDocument('quote', 404), null)
                const created = quote.created_at
                quote = await store.saveDocument(
                    'quote',
                    { client_id: client.id, name: 'Devis corrigé' },
                    [{ ...line, unit_price: 1.005 }],
                    quote.id
                )
                assert.equal(quote.created_at, created)
                assert.equal(quote.name, 'Devis corrigé')
                assert.equal(
                    (await store.getDocument('quote', quote.id)).items[0]
                        .unit_price,
                    1.01
                )
                assert.equal(quote.subtotal_cents, 152)
                for (const [quantity, expected] of [
                    [1.005, 101],
                    [1.255, 126],
                    [0.145, 15],
                ]) {
                    quote = await store.saveDocument(
                        'quote',
                        {},
                        [{ ...line, quantity, unit_price: 1, tax_rate: 0 }],
                        quote.id
                    )
                    assert.equal(quote.total_cents, expected)
                }
                quote = await store.saveDocument(
                    'quote',
                    {},
                    [
                        {
                            ...line,
                            quantity: 1_000_000,
                            unit_price: 90_071_992.5,
                            tax_rate: 0,
                        },
                    ],
                    quote.id
                )
                assert.equal(quote.total_cents, 9_007_199_250_000_000)
            }
        )

        await t.test(
            'rejects invalid clients, lines and references without changing the file',
            async () => {
                const before = await fs.readFile(file, 'utf8')
                const invalid = [
                    () =>
                        store.saveDocument(
                            'quote',
                            { client_id: client.id, currency: 'USD' },
                            [line]
                        ),
                    () => store.saveClient({}),
                    () => store.saveClient({ company_name: 'A' }, 404),
                    () =>
                        store.saveDocument('quote', { client_id: 404 }, [line]),
                    () =>
                        store.saveDocument(
                            'quote',
                            { client_id: client.id },
                            []
                        ),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, description: '' },
                        ]),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, quantity: 0 },
                        ]),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, quantity: -1 },
                        ]),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, unit_price: NaN },
                        ]),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, unit_price: Infinity },
                        ]),
                    () =>
                        store.saveDocument('quote', { client_id: client.id }, [
                            { ...line, tax_rate: 101 },
                        ]),
                    () =>
                        store.saveProfile({
                            logo_url: 'https://example.test/logo.png',
                        }),
                    () =>
                        store.saveProfile({
                            logo_url: 'data:image/png;base64,aGVsbG8=',
                        }),
                    () =>
                        store.saveProfile({
                            logo_url: `data:image/png;base64,${Buffer.alloc(2 * 1024 * 1024 + 1).toString('base64')}`,
                        }),
                ]
                for (const attempt of invalid) await assert.rejects(attempt)
                assert.equal(await fs.readFile(file, 'utf8'), before)
            }
        )

        await t.test(
            'finalizes atomically, uses independent sequences, is idempotent and immutable',
            async () => {
                const year = new Intl.DateTimeFormat('fr-FR', {
                    year: 'numeric',
                    timeZone: 'Europe/Paris',
                }).format(new Date())
                quote = await store.finalizeDocument('quote', quote.id)
                assert.equal(quote.formatted_no, `D${year}0001`)
                assert.deepEqual(
                    await store.finalizeDocument('quote', quote.id),
                    quote
                )
                await assert.rejects(
                    () =>
                        store.saveDocument(
                            'quote',
                            { name: 'Changé' },
                            [line],
                            quote.id
                        ),
                    /finalisé/
                )
                invoice = await store.saveDocument(
                    'invoice',
                    {
                        client_id: client.id,
                        payment_date: '30 jours fin de mois',
                    },
                    [line]
                )
                const finalized = await Promise.all(
                    Array.from({ length: 8 }, () =>
                        store.finalizeDocument('invoice', invoice.id)
                    )
                )
                assert.ok(
                    finalized.every(
                        (result) => result.formatted_no === `F${year}0001`
                    )
                )
                assert.equal(
                    (await store.exportDatabase()).numberCounters.invoice[year],
                    1
                )
                await assert.rejects(
                    () => store.saveDocument('invoice', {}, [line], invoice.id),
                    /finalisé/
                )
            }
        )

        await t.test(
            'freezes profile, client, dates and logo when finalizing',
            async () => {
                const before = await store.getDocument('quote', quote.id)
                assert.equal(
                    before.emitter_snapshot.company_name,
                    'Atelier local'
                )
                assert.equal(before.emitter_snapshot.logo_url, png)
                assert.deepEqual(
                    onlyBankDetails(before.emitter_snapshot),
                    bankDetails
                )
                const beforeInvoice = await store.getDocument(
                    'invoice',
                    invoice.id
                )
                assert.deepEqual(
                    onlyBankDetails(beforeInvoice.emitter_snapshot),
                    bankDetails
                )
                assert.equal(
                    before.client_snapshot.company_name,
                    'Client principal'
                )
                assert.ok(before.finalized_at >= before.created_at)
                await store.saveProfile({
                    company_name: 'Nouvelle identité',
                    bank_account_holder: 'Nouveau titulaire',
                    bank_name: 'Autre banque',
                    iban: 'FR1420041010050500013M02606',
                    bic: 'PSSTFRPPMON',
                })
                await store.saveClient(
                    { company_name: 'Client renommé' },
                    client.id
                )
                const after = await store.getDocument('quote', quote.id)
                assert.deepEqual(after, before)
                assert.deepEqual(
                    await store.getDocument('invoice', invoice.id),
                    beforeInvoice
                )
                await store.saveProfile({
                    company_name: 'Atelier local',
                    ...bankDetails,
                })
                await store.saveClient(
                    { company_name: 'Client principal' },
                    client.id
                )
            }
        )

        await t.test(
            'serializes multiple processes without lost writes or duplicate numbers',
            async () => {
                const code = `for(let i=0;i<5;i++){const d=await store.saveDocument('invoice',{client_id:1,name:'Worker'},[${JSON.stringify(line)}]);await store.finalizeDocument('invoice',d.id)}`
                await Promise.all(
                    Array.from({ length: 4 }, () => worker(code, directory))
                )
                const invoices = await store.listDocuments('invoice')
                assert.equal(invoices.length, 21)
                assert.equal(
                    new Set(invoices.map((entry) => entry.id)).size,
                    21
                )
                assert.equal(
                    new Set(invoices.map((entry) => entry.formatted_no)).size,
                    21
                )
                const sequences = invoices
                    .map((entry) => Number(entry.formatted_no.slice(5)))
                    .sort((a, b) => a - b)
                assert.deepEqual(
                    sequences,
                    Array.from({ length: 21 }, (_, i) => i + 1)
                )
                const persisted = await worker(
                    "console.log(JSON.stringify({profile:await store.getProfile(),invoices:await store.listDocuments('invoice')}))",
                    directory
                )
                const snapshot = JSON.parse(persisted.stdout)
                assert.equal(snapshot.profile.company_name, 'Atelier local')
                assert.equal(snapshot.invoices.length, 21)
            }
        )

        await t.test(
            'validates backup versions, relationships, totals, IDs, numbers and counters',
            async () => {
                const baseline = await store.exportDatabase()
                const before = await fs.readFile(file, 'utf8')
                const corruptions = [
                    (db) => {
                        db.quotes[0].client_snapshot.id = 404
                    },
                    (db) => {
                        db.quotes[0].emitter_snapshot.logo_url = 'bad'
                    },
                    (db) => {
                        db.quotes[0].finalized_at = '2000-01-01T00:00:00.000Z'
                    },
                    (db) => {
                        db.version = 2
                    },
                    (db) => {
                        db.clients = []
                    },
                    (db) => {
                        db.clients.push(db.clients[0])
                    },
                    (db) => {
                        db.quotes[0].items[0].quote_id = 404
                    },
                    (db) => {
                        db.quotes[0].total_cents++
                    },
                    (db) => {
                        db.quotes[0].items[0].total_price++
                    },
                    (db) => {
                        db.invoices[1].items[0].id = db.invoices[0].items[0].id
                    },
                    (db) => {
                        db.invoices[1].formatted_no =
                            db.invoices[0].formatted_no
                    },
                    (db) => {
                        db.nextIds.invoice = 1
                    },
                    (db) => {
                        db.numberCounters.invoice = {}
                    },
                    (db) => {
                        db.invoices[0].created_at = '2026-02-31T00:00:00.000Z'
                    },
                    (db) => {
                        db.profile.logo_url = 'bad'
                    },
                ]
                for (const corrupt of corruptions) {
                    const candidate = structuredClone(baseline)
                    corrupt(candidate)
                    await assert.rejects(() => store.importDatabase(candidate))
                }
                assert.equal(await fs.readFile(file, 'utf8'), before)
            }
        )

        await t.test(
            'imports roundtrip data and preserves the previous file as a backup',
            async () => {
                const baseline = await store.exportDatabase()
                await store.saveProfile({ company_name: 'Après export' })
                const before = await fs.readFile(file, 'utf8')
                await store.importDatabase(baseline)
                assert.deepEqual(await store.exportDatabase(), baseline)
                const backups = (await fs.readdir(directory)).filter((name) =>
                    name.startsWith('easinvoice.before-import-')
                )
                assert.equal(backups.length, 1)
                assert.equal(
                    await fs.readFile(path.join(directory, backups[0]), 'utf8'),
                    before
                )
                assert.equal((await store.getProfile()).logo_url, png)
                assert.deepEqual(
                    onlyBankDetails(await store.getProfile()),
                    bankDetails
                )
                assert.deepEqual(
                    onlyBankDetails(
                        (await store.getDocument('invoice', invoice.id))
                            .emitter_snapshot
                    ),
                    bankDetails
                )
            }
        )

        await t.test(
            'reads and restores legacy profiles and finalized snapshots without bank fields',
            async () => {
                const baseline = await store.exportDatabase()
                const legacy = structuredClone(baseline)
                for (const field of bankFields) {
                    delete legacy.profile[field]
                    for (const document of [
                        ...legacy.quotes,
                        ...legacy.invoices,
                    ]) {
                        if (document.emitter_snapshot)
                            delete document.emitter_snapshot[field]
                    }
                }
                await fs.writeFile(file, JSON.stringify(legacy))
                assert.deepEqual(
                    onlyBankDetails(await store.getProfile()),
                    emptyBankDetails
                )
                assert.deepEqual(
                    onlyBankDetails(
                        (await store.getDocument('invoice', invoice.id))
                            .emitter_snapshot
                    ),
                    emptyBankDetails
                )
                await store.importDatabase(legacy)
                await store.saveProfile(bankDetails)
                assert.deepEqual(
                    onlyBankDetails(
                        (await store.getDocument('invoice', invoice.id))
                            .emitter_snapshot
                    ),
                    emptyBankDetails
                )
                await store.importDatabase(baseline)
                assert.deepEqual(await store.exportDatabase(), baseline)
            }
        )

        await t.test(
            'restoring an older backup never reissues used numbers or identifiers',
            async () => {
                const previous = await store.exportDatabase()
                const newer = await store.saveDocument(
                    'invoice',
                    { client_id: client.id },
                    [line]
                )
                const finalized = await store.finalizeDocument(
                    'invoice',
                    newer.id
                )
                const usedSequence = Number(finalized.formatted_no.slice(5))
                await store.importDatabase(previous)
                assert.equal(await store.getDocument('invoice', newer.id), null)
                const next = await store.saveDocument(
                    'invoice',
                    { client_id: client.id },
                    [line]
                )
                assert.ok(next.id > newer.id)
                const published = await store.finalizeDocument(
                    'invoice',
                    next.id
                )
                assert.equal(
                    Number(published.formatted_no.slice(5)),
                    usedSequence + 1
                )
            }
        )

        await t.test(
            'older backups without snapshots acquire stable historical identities',
            async () => {
                const previous = await store.exportDatabase()
                delete previous.quotes[0].emitter_snapshot
                delete previous.quotes[0].client_snapshot
                delete previous.quotes[0].finalized_at
                await store.importDatabase(previous)
                const restored = await store.getDocument('quote', quote.id)
                assert.equal(
                    restored.emitter_snapshot.company_name,
                    previous.profile.company_name
                )
                assert.equal(
                    restored.client_snapshot.company_name,
                    previous.clients[0].company_name
                )
                await store.saveProfile({
                    company_name: 'Changed after restore',
                })
                await store.saveClient(
                    { company_name: 'Changed client after restore' },
                    client.id
                )
                assert.deepEqual(
                    await store.getDocument('quote', quote.id),
                    restored
                )
            }
        )

        await t.test(
            'preserves corrupt current data and supports explicit restore with a raw backup',
            async () => {
                const valid = await store.exportDatabase()
                const invalid = '{"version":1,"broken":'
                await fs.writeFile(file, invalid)
                await assert.rejects(() => store.getProfile(), /conservé/)
                await assert.rejects(
                    () =>
                        store.saveProfile({
                            company_name: 'Must not overwrite',
                        }),
                    /conservé/
                )
                assert.equal(await fs.readFile(file, 'utf8'), invalid)
                await store.importDatabase(valid)
                assert.deepEqual(await store.exportDatabase(), valid)
                const backups = (await fs.readdir(directory)).filter((name) =>
                    name.startsWith('easinvoice.before-import-')
                )
                const contents = await Promise.all(
                    backups.map((name) =>
                        fs.readFile(path.join(directory, name), 'utf8')
                    )
                )
                assert.ok(contents.includes(invalid))
            }
        )

        await t.test(
            'recovers a lock whose owning process has exited',
            async () => {
                const child = await worker('', directory)
                const lock = path.join(directory, 'easinvoice.lock')
                await fs.mkdir(lock, { recursive: true })
                await fs.writeFile(
                    path.join(lock, `${child.pid}-aaaaaaaa.json`),
                    JSON.stringify({ choosing: false, ticket: 1 })
                )
                await fs.writeFile(
                    path.join(lock, `${child.pid}-bbbbbbbb.json`),
                    ''
                )
                await store.saveProfile({ city: 'Lyon' })
                assert.equal((await store.getProfile()).city, 'Lyon')
                assert.deepEqual(await fs.readdir(lock), [])
            }
        )
    } finally {
        if (previousDirectory === undefined)
            delete process.env.EASINVOICE_DATA_DIR
        else process.env.EASINVOICE_DATA_DIR = previousDirectory
        await fs.rm(directory, { recursive: true, force: true })
    }
})
