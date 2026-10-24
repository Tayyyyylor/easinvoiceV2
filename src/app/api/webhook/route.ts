import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        { error: 'Les paiements sont désactivés dans la version locale.' },
        { status: 410 }
    )
}
