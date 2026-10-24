import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        {
            error: 'La version locale est gratuite et ne nécessite aucun abonnement.',
        },
        { status: 410 }
    )
}
