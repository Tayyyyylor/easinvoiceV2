import { NextResponse, type NextRequest } from 'next/server'

export function POST(request: NextRequest) {
    return NextResponse.redirect(new URL('/dashboard', request.url), {
        status: 303,
    })
}
