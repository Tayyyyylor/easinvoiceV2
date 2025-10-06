/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

type QuotePdfProps = {
    quote: any
    items: Array<{
        description: string
        quantity: number
        unit_price: number
        tax_rate: number
        total_price: number
        type?: string
    }>
    theme?: {
        primaryColor?: string
        hideTax?: boolean
    }
}

export function QuotePdf({ quote, items, theme = {} }: QuotePdfProps) {
    const primaryColor = theme.primaryColor ?? '#111827'
    const showTax = theme.hideTax !== true

    const styles = StyleSheet.create({
        page: { padding: 32, fontSize: 11 },
        title: { fontSize: 18, color: primaryColor, marginBottom: 12 },
        section: { marginTop: 12 },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
        },
        th: { fontWeight: 700 },
    })

    const euro = (v: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(v)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Devis #{quote?.id}</Text>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.th}>Objet</Text>
                        <Text>{quote?.description ?? '-'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.th}>Validité (jours)</Text>
                        <Text>{quote?.validity_days ?? '-'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ ...styles.row, marginBottom: 8 }}>
                        <Text style={styles.th}>Description</Text>
                        <Text style={styles.th}>Qté x PU</Text>
                    </View>
                    {items.map((it, i) => (
                        <View key={i} style={styles.row}>
                            <Text>{it.description}</Text>
                            <Text>
                                {it.quantity} x {euro(it.unit_price)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text>Sous-total</Text>
                        <Text>{euro((quote?.subtotal_cents ?? 0) / 100)}</Text>
                    </View>
                    {showTax && (
                        <View style={styles.row}>
                            <Text>Taxes</Text>
                            <Text>{euro((quote?.tax_cents ?? 0) / 100)}</Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text>Total</Text>
                        <Text>{euro((quote?.total_cents ?? 0) / 100)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
