import { NextResponse, type NextRequest } from 'next/server'

const localHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

export function middleware(request: NextRequest) {
    // Next peut normaliser l’URL interne sur localhost même quand le navigateur
    // utilise 127.0.0.1. L’en-tête Host conserve l’adresse réellement ouverte.
    let requestedUrl: URL
    try {
        requestedUrl = new URL(
            `${request.nextUrl.protocol}//${request.headers.get('host') ?? request.nextUrl.host}`
        )
    } catch {
        return NextResponse.json(
            { error: 'Adresse locale invalide.' },
            { status: 403 }
        )
    }

    if (!localHosts.has(requestedUrl.hostname)) {
        return NextResponse.json(
            {
                error: 'Cette application est réservée à un usage sur localhost.',
            },
            { status: 403 }
        )
    }

    const origin = request.headers.get('origin')
    if (origin && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        try {
            if (new URL(origin).origin !== requestedUrl.origin) {
                return NextResponse.json(
                    { error: 'Origine de la requête non autorisée.' },
                    { status: 403 }
                )
            }
        } catch {
            return NextResponse.json(
                { error: 'Origine de la requête invalide.' },
                { status: 403 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
