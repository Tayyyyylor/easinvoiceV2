import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // const isProduction = process.env.NODE_ENV === 'production' // or true for testing
    const isProduction = true // Temporaire pour tester le mode maintenance en dev
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
    const maintenanceBypassTokens =
        process.env.MAINTENANCE_BYPASS_TOKENS?.split(',').map((t) =>
            t.trim()
        ) || []

    const url = request.nextUrl.clone()

    // Vérifier si l'utilisateur a un token de bypass valide
    const bypassToken = request.cookies.get('maintenance-bypass')?.value
    const hasValidBypassToken =
        bypassToken && maintenanceBypassTokens.includes(bypassToken)

    // 1) Condition Maintenance
    //    On redirige TOUT sauf /maintenance, /_next, /_vercel, etc. et les utilisateurs avec un token valide
    if (
        isProduction &&
        maintenanceMode &&
        !hasValidBypassToken &&
        !url.pathname.startsWith('/maintenance') &&
        !url.pathname.startsWith('/_next') &&
        !url.pathname.startsWith('/_vercel') &&
        // on exclut aussi les fichiers statiques (pattern .*\\..*),
        // sinon vous risquez de bloquer les assets CSS/JS
        !/.*\..*$/.test(url.pathname)
    ) {
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/maintenance')) {
        return NextResponse.next()
    }
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
