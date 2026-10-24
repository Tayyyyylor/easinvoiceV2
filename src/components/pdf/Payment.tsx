import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Payment = ({
    invoice,
    emitter,
}: {
    invoice: Invoices
    emitter?: Profile
}) => {
    const styles = StyleSheet.create({
        container: {
            marginTop: 14,
            flexDirection: 'row',
            gap: 16,
            fontSize: 9.5,
        },
        payment: { flex: 1 },
        title: { fontSize: 11, marginBottom: 6, fontWeight: 700 },
        label: { color: '#4b5563', marginBottom: 3 },
        bankDetails: { flex: 1, padding: 10, backgroundColor: '#f3f4f6' },
        bankRow: { flexDirection: 'row', marginBottom: 3 },
        bankLabel: { width: 62, color: '#4b5563', flexShrink: 0 },
        bankValue: { flex: 1 },
    })
    const bankDetails = [
        { label: 'Titulaire', value: emitter?.bank_account_holder },
        { label: 'Banque', value: emitter?.bank_name },
        {
            label: 'IBAN',
            value: emitter?.iban
                ?.replace(/\s/g, '')
                .replace(/(.{4})(?=.)/g, '$1 '),
        },
        { label: 'BIC / SWIFT', value: emitter?.bic },
    ].filter((detail) => detail.value?.trim())

    return (
        <View style={styles.container}>
            <View style={styles.payment}>
                <Text style={styles.title}>Règlement</Text>
                {(invoice.payment_date || invoice.payment_method) && (
                    <Text style={styles.label}>
                        {invoice.payment_date
                            ? `Paiement à ${invoice.payment_date}`
                            : 'Paiement'}
                        {invoice.payment_method
                            ? ` par ${invoice.payment_method}`
                            : ''}
                        .
                    </Text>
                )}
                <Text style={styles.label}>
                    En cas de retard, pénalités : {invoice.interest_rate}% (art.
                    L441-10 C. com.).
                </Text>
                {invoice.tax_cents === 0 && (
                    <Text style={styles.label}>
                        TVA non applicable (article 293 B du CGI).
                    </Text>
                )}
            </View>
            {bankDetails.length > 0 && (
                <View style={styles.bankDetails} wrap={false}>
                    <Text style={styles.title}>Coordonnées bancaires</Text>
                    {bankDetails.map((detail) => (
                        <View key={detail.label} style={styles.bankRow}>
                            <Text style={styles.bankLabel}>{detail.label}</Text>
                            <Text style={styles.bankValue}>{detail.value}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}
