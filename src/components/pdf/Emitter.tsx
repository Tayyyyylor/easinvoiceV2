import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Emitter = ({ emitter }: { emitter: Profile | null }) => {
    const styles = StyleSheet.create({
        container: { width: '60%' },
        th: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
        label: { color: 'grey' },
        rowInfos: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 6,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 8,
        },
        labelCol: { width: 70 },
        bold: { fontWeight: 700 },
    })

    const data = [
        {
            label: 'Société :',
            value: emitter?.company_name,
            bold: true,
        },
        {
            label: 'Nom :',
            value: `${emitter?.firstname} ${emitter?.lastname}`,
        },
        {
            label: 'Adresse :',
            value: emitter?.address,
        },
        {
            label: 'Code postal :',
            value: `${emitter?.zipcode} ${emitter?.city}`,
        },
        {
            label: 'Pays :',
            value: emitter?.country,
        },
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.th}>Émetteur</Text>
            <>
                {data.map((item, index) =>
                    item.value ? (
                        <View style={styles.rowInfos} key={index}>
                            <View style={styles.labelCol}>
                                <Text style={styles.label}>{item.label}</Text>
                            </View>
                            <Text style={item.bold ? styles.bold : {}}>
                                {item.value}
                            </Text>
                        </View>
                    ) : null
                )}
            </>
        </View>
    )
}
