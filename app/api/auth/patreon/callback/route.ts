import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exchangeCodeForToken, fetchPatreonUser } from '@/lib/patreon'
import { createSession } from '@/lib/session'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kafuideyinterviews.com'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // ── User denied access ────────────────────────────────────────────────────
  if (error) {
    return NextResponse.redirect(`${SITE_URL}/members?error=access_denied`)
  }

  // ── Missing params ────────────────────────────────────────────────────────
  if (!code || !state) {
    return NextResponse.redirect(`${SITE_URL}/members?error=invalid_request`)
  }

  // ── CSRF state check ──────────────────────────────────────────────────────
  const cookieStore = await cookies()
  const savedState  = cookieStore.get('patreon_oauth_state')?.value

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${SITE_URL}/members?error=state_mismatch`)
  }

  // Clear the state cookie — single use
  cookieStore.delete('patreon_oauth_state')

  try {
    // ── Exchange code → access token ────────────────────────────────────────
    const tokenData = await exchangeCodeForToken(code)

    // ── Fetch Patreon user + membership tier ────────────────────────────────
    const user = await fetchPatreonUser(tokenData.access_token)

    // ── Create encrypted session cookie ────────────────────────────────────
    await createSession({
      userId:   user.patreonId,
      name:     user.name,
      email:    user.email,
      tier:     user.tier ?? 'supporter',
      isActive: user.isActive,
    })

    // ── Redirect based on membership status ────────────────────────────────
    if (!user.isActive || !user.tier) {
      return NextResponse.redirect(`${SITE_URL}/members?status=not_member`)
    }

    return NextResponse.redirect(`${SITE_URL}/members?status=success`)
  } catch (err) {
    console.error('[Patreon OAuth callback error]', err)
    return NextResponse.redirect(`${SITE_URL}/members?error=server_error`)
  }
}
