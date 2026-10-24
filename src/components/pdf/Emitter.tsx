import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Emitter = ({
    emitter,
    compact = false,
}: {
    emitter: Profile
    compact?: boolean
}) => {
    const styles = StyleSheet.create({
        container: compact ? { flex: 1 } : { width: '60%' },
        th: {
            fontSize: compact ? 11 : 16,
            marginBottom: compact ? 6 : 12,
            fontWeight: 700,
        },
        label: { color: 'grey' },
        rowInfos: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: compact ? 4 : 6,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: compact ? 4 : 8,
        },
        labelCol: { width: 70, flexShrink: 0 },
        bold: { fontWeight: 700 },
        value: compact ? { flex: 1 } : {},
    })

    const data = [
        {
            label: 'Société :',
            value: emitter?.company_name,
            bold: true,
        },
        {
            label: 'Nom :',
            value: [emitter?.firstname, emitter?.lastname]
                .filter(Boolean)
                .join(' '),
        },
        {
            label: 'Adresse :',
            value: emitter?.address,
        },
        {
            label: 'Code postal :',
            value: [emitter?.zipcode, emitter?.city].filter(Boolean).join(' '),
        },
        {
            label: 'Pays :',
            value: emitter?.country,
        },
        { label: 'SIRET :', value: emitter?.siret },
        { label: 'Complément :', value: emitter?.additional_address },
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
                            <Text
                                style={[
                                    styles.value,
                                    item.bold ? styles.bold : {},
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    ) : null
                )}
            </>
        </View>
    )
}
