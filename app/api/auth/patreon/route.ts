import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { buildPatreonAuthUrl } from '@/lib/patreon'
import { randomBytes } from 'crypto'

export async function GET(): Promise<NextResponse> {
  // Generate a random state value to prevent CSRF
  const state = randomBytes(16).toString('hex')

  const cookieStore = await cookies()
  cookieStore.set('patreon_oauth_state', state, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 10, // 10 minutes — enough time to complete OAuth
  })

  const authUrl = buildPatreonAuthUrl(state)
  return NextResponse.redirect(authUrl)
}
