export const toNumber = (v: FormDataEntryValue | null) => {
    if (v === null) return null
    const s = String(v).trim()
    if (s === '') return null
    const n = Number(s.replace(',', '.'))
    return Number.isFinite(n) ? n : null
}

export const eurosToCents = (euro: number) => Math.round(euro * 100)
