/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from '@supabase/supabase-js'
import { eurosToCents, toNumber } from './conversions'

export interface LineItem {
    description: string
    type?: string
    quantity: number
    total_price: number
    unit_price: number
    tax_rate: number
}

export interface LineTotals {
    subtotal_cents: number
    tax_cents: number
    total_cents: number
}

/**
 * Parse les lignes (lines) depuis un FormData ou un payload JSON
 * @param formData Le FormData contenant les lignes
 * @param payload Le payload JSON optionnel
 * @returns Un tableau de lignes parsées
 */
export function parseLines(
    formData: FormData,
    payload?: { lines?: any[] } | null
): LineItem[] {
    const linesMap = new Map<number, Record<string, any>>()

    // Parse les lignes depuis le FormData
    for (const [key, value] of formData.entries()) {
        const m = key.match(/^lines(?:\[(\d+)\]|\.(\d+))\.(.+)$/) // support lines[0].x or lines.0.x
        if (m) {
            const idx = Number(m[1] ?? m[2])
            const field = m[3]
            if (!linesMap.has(idx)) linesMap.set(idx, {})
            linesMap.get(idx)![field] = value
        }
    }

    // Si payload fourni, on récupère les lignes depuis payload
    if (linesMap.size === 0 && payload?.lines && Array.isArray(payload.lines)) {
        payload.lines.forEach((l: any, i: number) => linesMap.set(i, l))
    }

    const linesArr: LineItem[] = []

    for (const [, obj] of Array.from(linesMap.entries()).sort(
        (a, b) => a[0] - b[0]
    )) {
        const desc = (obj.description ?? obj.label ?? '') + ''
        const type = (obj.type ?? 'service') + ''
        const quantity = toNumber(obj.quantity ?? obj.qty ?? '1') ?? 1
        const unit_price =
            toNumber(obj.unit_price ?? obj.unit_price_eur ?? '0') ?? 0
        const tax_rate_pct = toNumber(obj.tax_rate ?? obj.tax ?? '0') ?? 0

        const unit_price_cents = eurosToCents(unit_price)
        const line_total_cents = Math.round(quantity * unit_price_cents)

        linesArr.push({
            description: desc,
            type,
            quantity,
            unit_price,
            total_price: line_total_cents,
            tax_rate: tax_rate_pct,
        })
    }

    return linesArr
}

/**
 * Calcule les totaux (subtotal, tax, total) depuis un tableau de lignes
 * @param lines Le tableau de lignes
 * @returns Les totaux calculés en centimes
 */
export function calculateTotals(lines: LineItem[]): LineTotals {
    const subtotal_cents = lines.reduce((s, l) => s + (l.total_price ?? 0), 0)

    // calcul des taxes : pour chaque ligne, taxe = line_total * tax_rate_pct/100
    const tax_cents = lines.reduce(
        (s, l) =>
            s + Math.round(((l.total_price ?? 0) * (l.tax_rate ?? 0)) / 100),
        0
    )

    const total_cents = subtotal_cents + tax_cents

    return {
        subtotal_cents,
        tax_cents,
        total_cents,
    }
}

interface DocumentSequence {
    supabase: SupabaseClient
    userId: string
    documentType: 'invoice' | 'quote'
}

export async function generateDocumentNumber({
    supabase,
    userId,
    documentType = 'invoice',
}: DocumentSequence): Promise<string> {
    const currentYear = new Date().getFullYear()

    // Récupérer ou créer la séquence pour cette année et cet utilisateur
    const { data: sequence, error: fetchError } = await supabase
        .from(`${documentType}_sequence`)
        .select('*')
        .eq('owner_id', userId)
        .eq('year', currentYear)
        .single()

    let nextNumber = 1

    if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (c'est OK, on va créer)
        console.error(
            'Erreur lors de la récupération de la séquence:',
            fetchError
        )
        throw fetchError
    }

    if (sequence && sequence.last_value && sequence.last_value > 0) {
        // La séquence existe, on incrémente
        nextNumber = sequence.last_value + 1

        const { error: updateError } = await supabase
            .from(`${documentType}_sequence`)
            .update({ last_value: nextNumber })
            .eq('id', sequence.id)

        if (updateError) {
            console.error(
                'Erreur lors de la mise à jour de la séquence:',
                updateError
            )
            throw updateError
        }
    } else {
        // Première facture de l'année, on crée la séquence
        const { error: insertError } = await supabase
            .from(`${documentType}_sequence`)
            .insert({
                owner_id: userId,
                year: currentYear,
                last_value: nextNumber,
            })

        if (insertError) {
            console.error(
                'Erreur lors de la création de la séquence:',
                insertError
            )
            throw insertError
        }
    }

    // Formater le numéro: f + année + numéro sur 4 chiffres
    const formattedNumber = `${documentType === 'invoice' ? 'F' : 'D'}${currentYear}${nextNumber.toString().padStart(4, '0')}`
    return formattedNumber
}
