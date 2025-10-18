import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Emitter } from './Emitter'
import { Recipient } from './Recipient'
import { Desc } from './Desc'
import { Totals } from './Totals'
import { Header } from './Header'
import { Payment } from './Payment'

type InvoicePdfProps = {
    invoice: Invoices
    emitter: Profile
    client?: Clients
    items: InvoiceItems[]
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
                <Header emitter={emitter} />
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
                    <Totals item={invoice} />
                    <Payment invoice={invoice} />
                </View>
            </Page>
        </Document>
    )
}
