import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Recipient = ({
    client,
    compact = false,
}: {
    client?: Clients
    compact?: boolean
}) => {
    const styles = StyleSheet.create({
        container: compact ? { flex: 1 } : { width: '40%' },
        th: {
            fontSize: compact ? 11 : 16,
            marginBottom: compact ? 6 : 12,
            fontWeight: 700,
        },
        label: { color: 'grey' },
        bold: { fontWeight: 700 },
        rowInfos: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: compact ? 4 : 6,
            gap: compact ? 4 : 0,
        },
        labelCol: { width: 70, flexShrink: 0 },
        value: compact ? { flex: 1 } : {},
    })
    const data = [
        {
            label: 'Société :',
            value: client?.company_name,
            bold: true,
        },
        {
            label: 'Nom :',
            value: [client?.firstname, client?.lastname]
                .filter(Boolean)
                .join(' '),
            bold: true,
        },
        {
            label: 'Adresse :',
            value: client?.address,
        },
        {
            label: 'Code postal :',
            value: [client?.zipcode, client?.city].filter(Boolean).join(' '),
        },
        {
            label: 'Pays :',
            value: client?.country,
        },
        { label: 'SIRET :', value: client?.siret },
        { label: 'Complément :', value: client?.additional_address },
    ]
    return (
        <View style={styles.container}>
            <Text style={styles.th}>Destinataire</Text>
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
