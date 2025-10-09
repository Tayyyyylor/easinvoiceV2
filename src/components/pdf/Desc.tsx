/* eslint-disable @typescript-eslint/no-explicit-any */
import { euro } from '@/helpers/pdf'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Desc = ({ items, showTax }: { items: any; showTax: any }) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: 10,
        },
        subtitle: { fontSize: 14, marginBottom: 12 },
        th: { fontWeight: 700 },
        // Table styles
        table: {
            display: 'flex',
            flexDirection: 'column',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderStyle: 'solid',
        },
        tableHeader: {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#dadcdf',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            borderBottomStyle: 'solid',
            paddingVertical: 6,
            paddingHorizontal: 8,
        },
        tableRow: {
            display: 'flex',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            borderBottomStyle: 'solid',
            padding: 8,
        },
        cellDescription: { flex: 4 },
        cellType: { flex: 1, fontWeight: 500 },
        cellQty: { flex: 1, textAlign: 'right', fontWeight: 500 },
        cellUnit: { flex: 2, textAlign: 'right', fontWeight: 500 },
        cellTax: { flex: 1, textAlign: 'right', fontWeight: 500 },
        cellTotal: { flex: 2, textAlign: 'right', fontWeight: 500 },
    })
    return (
        <View style={styles.container}>
            <Text style={[styles.subtitle, styles.th]}>Détails</Text>
            {/* Table header */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.cellType}>Type</Text>
                    <Text style={styles.cellDescription}>Description</Text>
                    <Text style={styles.cellQty}>Qté</Text>
                    <Text style={styles.cellUnit}>Prix Unitaire HT</Text>
                    {showTax && <Text style={styles.cellTax}>TVA</Text>}
                    <Text style={styles.cellTotal}>Total HT</Text>
                </View>
                {/* Table rows */}
                {items.map((it: any, i: any) => {
                    console.log('test it', it)
                    return (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.cellType}>{it.type}</Text>
                            <Text style={styles.cellDescription}>
                                {it.description}
                            </Text>
                            <Text style={styles.cellQty}>{it.quantity}</Text>
                            <Text style={styles.cellUnit}>
                                {euro(it.unit_price)}
                            </Text>
                            {showTax && (
                                <Text style={styles.cellTax}>
                                    {`${(it.tax_rate ?? 0).toFixed(0)}%`}
                                </Text>
                            )}
                            <Text style={styles.cellTotal}>
                                {euro(it.total_price)}
                            </Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}
