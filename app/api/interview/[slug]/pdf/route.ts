import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { interviewBySlugQuery, type InterviewFull } from '@/sanity/lib/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/interview/[slug]/pdf
 *
 * Generates and streams a beautifully typeset PDF of the interview story.
 * The PDF is rendered server-side using @react-pdf/renderer.
 *
 * Response headers instruct the browser to download the file with a
 * sensible filename rather than opening it inline.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params

  const client = createClient({
    projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn:     false,
  })

  // ── Fetch interview from Sanity ──────────────────────────────────────────
  const interview: InterviewFull | null = await client.fetch(
    interviewBySlugQuery,
    { slug },
    { next: { revalidate: 300 } },
  )

  if (!interview) {
    return NextResponse.json({ message: 'Interview not found.' }, { status: 404 })
  }

  // ── Block download of Patreon-only content without a session ────────────
  // NOTE: Full tier-checking requires reading the session cookie here.
  // For now we allow public downloads of non-gated interviews and
  // return 403 for Patreon-only ones (the session check can be
  // wired in once the Patreon OAuth is live).
  if (interview.isPatreonOnly) {
    return NextResponse.json(
      { message: 'This interview is for Patreon members only.' },
      { status: 403 },
    )
  }

  try {
    // ── Dynamic imports to avoid Turbopack bundling issues ───────────────────
    const reactPdf = await import('@react-pdf/renderer')
    const { createElement } = await import('react')
    const { InterviewPDFDocument } = await import('@/components/interview/InterviewPDF')

    // Debug: log available exports on first call so we can diagnose import issues
    console.log('[PDF] Available exports:', Object.keys(reactPdf))

    // ── Build React element ──────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = createElement(InterviewPDFDocument as any, { interview }) as any

    // ── Render PDF ───────────────────────────────────────────────────────
    // Prefer renderToStream (returns a Node.js ReadableStream), then fall
    // back to renderToBuffer if it is available in this build.
    let pdfBuffer: Buffer

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = reactPdf as any

    if (typeof mod.renderToStream === 'function') {
      const stream: AsyncIterable<Uint8Array> = await mod.renderToStream(element)
      const chunks: Buffer[] = []
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      pdfBuffer = Buffer.concat(chunks)
    } else if (typeof mod.renderToBuffer === 'function') {
      pdfBuffer = await mod.renderToBuffer(element)
    } else {
      throw new Error(
        `Neither renderToStream nor renderToBuffer is available. Exports: ${Object.keys(reactPdf).join(', ')}`,
      )
    }

    // ── Build a safe filename from guest + title ─────────────────────────
    const safeName = `kafuidey-${interview.guest}-${interview.slug.current}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status:  200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Content-Length':      String(pdfBuffer.byteLength),
        'Cache-Control':       'public, max-age=300, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : ''
    console.error('[PDF generation error]', err)
    return NextResponse.json(
      { message: 'PDF generation failed.', error: msg, stack },
      { status: 500 },
    )
  }
}