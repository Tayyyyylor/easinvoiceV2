/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Emitter } from './Emitter'
import { Recipient } from './Recipient'
import { Desc } from './Desc'
import { Totals } from './Totals'

type InvoicePdfProps = {
    invoice: any
    emitter: any
    client: any
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

export function InvoicePdf({
    invoice,
    items,
    theme = {},
    emitter,
    client,
}: InvoicePdfProps) {
    const primaryColor = theme.primaryColor ?? '#111827'
    const showTax = theme.hideTax !== true

    const styles = StyleSheet.create({
        page: { padding: 32, fontSize: 11 },
        title: { fontSize: 18, color: primaryColor, marginBottom: 4 },
        date: { fontSize: 12, color: 'grey', marginBottom: 12 },
        subtitle: { fontSize: 14, color: primaryColor, marginBottom: 12 },
        personalInfos: {
            marginTop: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        th: { fontWeight: 700 },
        section: {
            marginBottom: 20,
        },
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Devis Provisoire</Text>
                <Text style={styles.date}>
                    {new Date().toLocaleDateString('fr-FR')}
                </Text>

                <View>
                    <View style={styles.personalInfos}>
                        <Emitter emitter={emitter} />
                        <Recipient client={client} />
                    </View>
                    <View>
                        <View style={styles.section}>
                            <Text style={[styles.subtitle, styles.th]}>
                                Description
                            </Text>
                            <Text>{invoice?.description}</Text>
                        </View>
                        <Desc items={items} showTax={showTax} />
                    </View>
                    <Totals item={invoice} showTax={showTax} />
                </View>
            </Page>
        </Document>
    )
}
