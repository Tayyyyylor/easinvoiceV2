import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const Header = ({
    emitter,
    title,
    date,
    compact = false,
}: {
    emitter?: Profile
    title: string
    date: string
    compact?: boolean
}) => {
    const styles = StyleSheet.create({
        container: {
            width: compact ? '100%' : '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: compact ? 10 : 16,
            marginBottom: compact ? 16 : 18,
        },
        titleContainer: {
            flexShrink: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        title: { fontSize: 18, marginBottom: compact ? 4 : 2 },
        date: { fontSize: compact ? 10 : 12, color: 'grey' },
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

    const logoUrl = emitter?.logo_url

    return (
        <View style={styles.container}>
            {logoUrl && (
                <Image src={logoUrl} style={styles.logo} aria-label="Logo" />
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>
                    {new Date(date).toLocaleDateString('fr-FR', {
                        timeZone: 'Europe/Paris',
                    })}
                </Text>
            </View>
        </View>
    )
}
