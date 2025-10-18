import '../globals.css'

export const metadata = {
    title: 'Maintenance',
    description: 'Site en maintenance',
}

export default function MaintenanceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body className="antialiased">{children}</body>
        </html>
    )
}
