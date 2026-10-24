export const toNumber = (v: FormDataEntryValue | null) => {
    if (v === null) return null
    const s = String(v).trim()
    if (s === '') return null
    const n = Number(s.replace(',', '.'))
    return Number.isFinite(n) ? n : null
}

/** Round positive decimal amounts exactly, including fractional quantities. */
export function roundDecimalProduct(
    value: number,
    multiplier: number,
    divisor = 1
): number {
    if (
        !Number.isFinite(value) ||
        value < 0 ||
        !Number.isSafeInteger(multiplier) ||
        multiplier < 0 ||
        !Number.isSafeInteger(divisor) ||
        divisor <= 0
    ) {
        throw new Error(
            'Les montants doivent être des nombres positifs ou nuls valides.'
        )
    }
    // Keep decimal half cents exact: 1.005 × 100 is 101, without changing
    // large integer amounts by adding a floating point tolerance.
    const [coefficient, exponent = '0'] = value.toString().split('e')
    const fractionLength = coefficient.split('.')[1]?.length ?? 0
    const power = Number(exponent) - fractionLength
    let numerator = BigInt(coefficient.replace('.', '')) * BigInt(multiplier)
    let denominator = BigInt(divisor)
    if (power >= 0) numerator *= BigInt(10) ** BigInt(power)
    else denominator *= BigInt(10) ** BigInt(-power)
    const result = Number(
        (numerator * BigInt(2) + denominator) / (denominator * BigInt(2))
    )
    if (!Number.isSafeInteger(result))
        throw new Error('Le montant est trop élevé.')
    return result
}

export const eurosToCents = (euro: number) => roundDecimalProduct(euro, 100)
