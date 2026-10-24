import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Emitter } from './Emitter'
import { Recipient } from './Recipient'
import { Desc } from './Desc'
import { Totals } from './Totals'
import { Header } from './Header'

type QuotePdfProps = {
    quote: Quotes
    emitter: Profile
    client?: Clients
    items: QuoteItems[]
    theme?: {
        primaryColor?: string
        hideTax?: boolean
    }
}

export function QuotePdf({
    quote,
    items,
    theme = {},
    emitter,
    client,
}: QuotePdfProps) {
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

    const isFinalized = quote.status === 'published'
    const title = isFinalized
        ? quote.formatted_no
        : `Devis provisoire ${quote.name ? `(${quote.name})` : ''}`

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header
                    emitter={emitter}
                    title={title}
                    date={quote.finalized_at ?? quote.created_at}
                />

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
                            <Text>{quote?.description}</Text>
                        </View>
                        <Desc items={items} showTax={showTax} />
                    </View>
                    <Totals item={quote} />
                    <Text>
                        Validité : {quote.validity_days} jours à compter de la
                        date du devis.
                    </Text>
                    {quote.terms && <Text>{quote.terms}</Text>}
                </View>
            </Page>
        </Document>
    )
}
