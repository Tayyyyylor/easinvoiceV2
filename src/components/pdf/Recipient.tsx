import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Recipient = ({ client }: { client?: Clients }) => {
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
    const data = [
        {
            label: 'Société :',
            value: client?.company_name,
            bold: true,
        },
        {
            label: 'Nom :',
            value: `${client?.firstname} ${client?.lastname}`,
            bold: true,
        },
        {
            label: 'Adresse :',
            value: client?.address,
        },
        {
            label: 'Code postal :',
            value: `${client?.zipcode} ${client?.city}`,
        },
        {
            label: 'Pays :',
            value: client?.country,
        },
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
