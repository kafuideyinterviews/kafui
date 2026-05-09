import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

const SANITY_PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET

/**
 * Called by the Sanity Studio iframe pane to enable Next.js Draft Mode.
 * URL: /api/preview?slug=<interview-slug>&secret=<SANITY_PREVIEW_SECRET>
 *
 * After enabling draft mode it redirects to the actual page, which will
 * then read draft (unpublished) content from Sanity via the CDN-bypassing client.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug   = searchParams.get('slug')

  // ── Validate secret ────────────────────────────────────────────────────
  if (SANITY_PREVIEW_SECRET && secret !== SANITY_PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // ── Enable Draft Mode ──────────────────────────────────────────────────
  const draft = await draftMode()
  draft.enable()

  // ── Redirect to the relevant page ─────────────────────────────────────
  if (slug) {
    redirect(`/interviews/${slug}`)
  }

  redirect('/')
}
