import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Header = ({ emitter }: { emitter?: Profile }) => {
    const styles = StyleSheet.create({
        container: {
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        titleContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        title: { fontSize: 18, marginBottom: 4 },
        date: { fontSize: 12, color: 'grey', marginBottom: 12 },
        th: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
        label: { color: 'grey' },
        logo: {
            width: 30,
            height: 30,
            objectFit: 'contain',
        },
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
            <Image src={emitter?.logo_url} style={styles.logo} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Devis Provisoire</Text>
                <Text style={styles.date}>
                    {new Date().toLocaleDateString('fr-FR')}
                </Text>
            </View>
        </View>
    )
}
