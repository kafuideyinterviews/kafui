import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { PatreonSession, PatreonTier } from '@/types'

const COOKIE_NAME = 'kd_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET env var must be at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

// ─── Create and set a signed session cookie ───────────────────────────────────
export async function createSession(payload: Omit<PatreonSession, 'iat' | 'exp'>): Promise<void> {
  const secret = getSecret()
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   SESSION_MAX_AGE,
  })
}

// ─── Read and verify session from cookie ─────────────────────────────────────
export async function getSession(): Promise<PatreonSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as PatreonSession
  } catch {
    return null
  }
}

// ─── Clear session cookie ─────────────────────────────────────────────────────
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// ─── Check if current session can access a required tier ─────────────────────
export async function sessionCanAccess(requiredTier: PatreonTier): Promise<boolean> {
  const session = await getSession()
  if (!session || !session.isActive || !session.tier) return false

  const levels: Record<PatreonTier, number> = {
    supporter:    1,
    insider:      2,
    inner_circle: 3,
  }

  return levels[session.tier] >= levels[requiredTier]
}
