import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kafuideyinterviews.com'

export async function GET(): Promise<NextResponse> {
  await clearSession()
  return NextResponse.redirect(`${SITE_URL}/members`)
}
