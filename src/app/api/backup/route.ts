import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { exportDatabase, importDatabase } from '@/lib/local-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const database = await exportDatabase()
        return new NextResponse(JSON.stringify(database, null, 2), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Disposition': `attachment; filename="easinvoice-${new Date().toISOString().slice(0, 10)}.json"`,
                'Cache-Control': 'no-store',
            },
        })
    } catch (error) {
        console.error('Échec de la sauvegarde locale :', error)
        return NextResponse.json(
            { error: 'Impossible de lire les données à sauvegarder.' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    if (!request.headers.get('content-type')?.includes('application/json')) {
        return NextResponse.json(
            { error: 'Choisissez un fichier de sauvegarde JSON.' },
            { status: 415 }
        )
    }

    let input: unknown
    try {
        const content = await request.text()
        input = JSON.parse(content)
    } catch {
        return NextResponse.json(
            { error: 'Le fichier ne contient pas un JSON valide.' },
            { status: 400 }
        )
    }

    try {
        await importDatabase(input)
        revalidatePath('/', 'layout')
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Échec de la restauration locale :', error)
        return NextResponse.json(
            {
                error: 'Impossible de restaurer cette sauvegarde. Vérifiez son format et l’accès au dossier de données.',
            },
            { status: 400 }
        )
    }
}
