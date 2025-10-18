import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { euro } from '@/helpers/pdf'

export const Totals = ({ item }: { item: Invoices | Quotes }) => {
    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        },
        subtitle: { fontSize: 12, fontWeight: 600 },
        row: {
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            alignItems: 'baseline',
        },
        labelCol: { width: 90, textAlign: 'right' },
        valueCol: { width: 100, textAlign: 'right' },
    })
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.labelCol}>
                    <Text style={styles.subtitle}>Total HT</Text>
                </View>
                <View style={styles.valueCol}>
                    <Text>{euro((item?.subtotal_cents ?? 0) / 100)}</Text>
                </View>
            </View>
            {item.tax_cents > 0 && (
                <View style={styles.row}>
                    <View style={styles.labelCol}>
                        <Text style={styles.subtitle}>TVA(%)</Text>
                    </View>
                    <View style={styles.valueCol}>
                        <Text>{euro((item?.tax_cents ?? 0) / 100)}</Text>
                    </View>
                </View>
            )}
            <View style={styles.row}>
                <View style={styles.labelCol}>
                    <Text style={styles.subtitle}>Total TTC</Text>
                </View>
                <View style={styles.valueCol}>
                    <Text>{euro((item?.total_cents ?? 0) / 100)}</Text>
                </View>
            </View>
        </View>
    )
}
