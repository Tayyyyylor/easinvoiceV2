import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Header = ({
    emitter,
    title,
}: {
    emitter?: Profile
    title: string
}) => {
    const styles = StyleSheet.create({
        container: {
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginBottom: 18,
        },
        titleContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        title: { fontSize: 18, marginBottom: 2 },
        date: { fontSize: 12, color: 'grey' },
        th: { fontSize: 16, marginBottom: 12, fontWeight: 700 },
        label: { color: 'grey' },
        logo: {
            width: 35,
            height: 35,
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

    // Ajouter un timestamp pour forcer le rechargement du logo (cache busting)
    const logoUrl = emitter?.logo_url
        ? `${emitter.logo_url}?t=${Date.now()}`
        : undefined

    return (
        <View style={styles.container}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>
                    {new Date().toLocaleDateString('fr-FR')}
                </Text>
            </View>
        </View>
    )
}
