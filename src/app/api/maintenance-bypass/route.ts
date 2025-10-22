import { NextRequest, NextResponse } from 'next/server'

// GET: Définir le cookie de bypass
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    const maintenanceBypassTokens =
        process.env.MAINTENANCE_BYPASS_TOKENS?.split(',').map((t) =>
            t.trim()
        ) || []

    // Vérifier si le token est valide
    if (!token || !maintenanceBypassTokens.includes(token)) {
        return NextResponse.json(
            {
                error: 'Token invalide ou manquant',
                debug: {
                    tokenReceived: token || '(aucun)',
                    allowedTokens: maintenanceBypassTokens.length,
                },
            },
            { status: 403 }
        )
    }

    // Créer une réponse avec le cookie
    const response = NextResponse.json({
        success: true,
        message: 'Cookie de bypass défini avec succès',
        cookie: {
            name: 'maintenance-bypass',
            value: token,
            expires: '24 heures',
        },
    })

    // Définir le cookie avec les bons paramètres
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('maintenance-bypass', token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 heures
        httpOnly: false, // Doit être lisible côté serveur ET client
        sameSite: 'lax',
        secure: isProduction, // true en production (HTTPS requis)
    })

    console.log('✅ Cookie défini avec succès')

    return response
}

// DELETE: Supprimer le cookie de bypass
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: 'Cookie de bypass supprimé avec succès',
    })

    // Supprimer le cookie en mettant maxAge à 0
    response.cookies.set('maintenance-bypass', '', {
        path: '/',
        maxAge: 0,
    })

    return response
}
