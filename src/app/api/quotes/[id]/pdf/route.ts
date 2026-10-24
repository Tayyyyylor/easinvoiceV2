import React from 'react'
import { NextResponse, type NextRequest } from 'next/server'
import type { DocumentProps } from '@react-pdf/renderer'
import { QuotePdf } from '@/components/pdf/QuotePdf'
import { getDocument, getClient, getProfile } from '@/lib/local-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const documentId = Number(id)
    if (!Number.isSafeInteger(documentId) || documentId <= 0) {
        return NextResponse.json(
            { error: 'Document introuvable.' },
            { status: 404 }
        )
    }
    const document = await getDocument('quote', documentId)
    if (!document) {
        return NextResponse.json(
            { error: 'Document introuvable.' },
            { status: 404 }
        )
    }
    const [emitter, client] = await Promise.all([
        getProfile(),
        getClient(document.client_id),
    ])
    const element = React.createElement(QuotePdf, {
        quote: document,
        items: document.items,
        emitter: document.emitter_snapshot ?? emitter,
        client: document.client_snapshot ?? client ?? undefined,
        theme: document.pdf_overrides ?? {},
    })
    // Load the Node renderer outside the React Server Components bundle.
    const { renderToBuffer } = await import(
        /* webpackIgnore: true */ '@react-pdf/renderer'
    )
    const buffer = await renderToBuffer(
        element as React.ReactElement<DocumentProps>
    )
    return new Response(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${document.formatted_no || 'quote-' + id}.pdf"`,
            'Cache-Control': 'no-store',
        },
    })
}
