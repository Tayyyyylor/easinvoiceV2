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
    const comfortable = items.length <= 6

    const styles = StyleSheet.create({
        page: {
            padding: 32,
            fontSize: comfortable ? 11 : 9.5,
            lineHeight: 1.3,
        },
        body: { flexGrow: 1 },
        footer: {
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            marginTop: 16,
        },
        subtitle: { fontSize: 11, color: primaryColor, marginBottom: 6 },
        personalInfos: {
            marginTop: 6,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
            gap: 18,
        },
        th: { fontWeight: 700 },
        section: {
            marginBottom: 16,
        },
        terms: { marginTop: 10, fontSize: 9 },
    })

    const isFinalized = invoice.status === 'published'
    const title = isFinalized
        ? invoice.formatted_no
        : `Facture provisoire ${invoice.name ? `(${invoice.name})` : ''}`
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.body}>
                    <Header
                        emitter={emitter}
                        title={title}
                        date={invoice.finalized_at ?? invoice.created_at}
                        compact
                    />
                    <View style={styles.personalInfos}>
                        <Emitter emitter={emitter} compact />
                        <Recipient client={client} compact />
                    </View>
                    <View>
                        {invoice.description && (
                            <View style={styles.section}>
                                <Text style={[styles.subtitle, styles.th]}>
                                    Description
                                </Text>
                                <Text>{invoice?.description}</Text>
                            </View>
                        )}
                        <Desc
                            items={items}
                            showTax={showTax}
                            compact
                            spacious={comfortable}
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <View wrap={false}>
                        <Totals item={invoice} compact />
                        <Payment invoice={invoice} emitter={emitter} />
                    </View>
                    {invoice.terms && (
                        <Text style={styles.terms}>{invoice.terms}</Text>
                    )}
                </View>
            </Page>
        </Document>
    )
}
