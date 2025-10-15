import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Payment = ({ invoice }: { invoice: Invoices }) => {
    const styles = StyleSheet.create({
        container: { width: '40%' },
        th: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
        label: { color: 'grey' },
        bold: { fontWeight: 700 },
        rowInfos: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 6,
        },
        labelCol: { width: 70 },
    })
    return (
        <View style={styles.container}>
            <Text style={styles.th}>Règlement</Text>
            {invoice.payment_date && invoice.payment_method ? (
                <Text style={styles.label}>
                    Paiement à {invoice.payment_date} par{' '}
                    {invoice.payment_method}.
                </Text>
            ) : (
                <Text style={styles.label}>
                    Paiement à {invoice.payment_date}.
                </Text>
            )}
            <Text style={styles.label}>
                En cas de retard, pénalités : {invoice.interest_rate}% (art.
                L441-10 C. com.).
            </Text>
            <Text style={styles.label}>
                {invoice.tax_cents === 0 &&
                    'TVA non applicable (article 293 B du CGI)'}
                .
            </Text>
        </View>
    )
}
