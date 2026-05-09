import type { PatreonTier } from '@/types'

const PATREON_BASE = 'https://www.patreon.com'
const PATREON_API  = 'https://www.patreon.com/api/oauth2/v2'

// ─── Config (all server-side only) ───────────────────────────────────────────
export function getPatreonConfig() {
  const clientId     = process.env.PATREON_CLIENT_ID
  const clientSecret = process.env.PATREON_CLIENT_SECRET
  const redirectUri  = process.env.PATREON_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Patreon OAuth environment variables')
  }
  return { clientId, clientSecret, redirectUri }
}

// ─── Step 1: Build the OAuth authorisation URL ────────────────────────────────
export function buildPatreonAuthUrl(state: string): string {
  const { clientId, redirectUri } = getPatreonConfig()
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     clientId,
    redirect_uri:  redirectUri,
    scope:         'identity identity[email] identity.memberships',
    state,
  })
  return `${PATREON_BASE}/oauth2/authorize?${params.toString()}`
}

// ─── Step 2: Exchange code for access token ───────────────────────────────────
type TokenResponse = {
  access_token:  string
  refresh_token: string
  expires_in:    number
  token_type:    string
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const { clientId, clientSecret, redirectUri } = getPatreonConfig()

  const res = await fetch(`${PATREON_BASE}/api/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type:    'authorization_code',
      client_id:     clientId,
      client_secret: clientSecret,
      redirect_uri:  redirectUri,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Patreon token exchange failed: ${res.status} ${body}`)
  }

  return res.json() as Promise<TokenResponse>
}

// ─── Campaign ID ──────────────────────────────────────────────────────────────
// Set your actual Patreon campaign ID as an env variable
function getCampaignId(): string {
  const id = process.env.PATREON_CAMPAIGN_ID
  if (!id) throw new Error('PATREON_CAMPAIGN_ID env var is not set')
  return id
}

// ─── Patreon API response shapes (minimal) ────────────────────────────────────
type PatreonMemberAttributes = {
  patron_status: 'active_patron' | 'declined_patron' | 'former_patron' | null
  currently_entitled_amount_cents: number
}

type PatreonTierAttributes = {
  title: string
  amount_cents: number
}

type PatreonIncluded =
  | { type: 'tier'; id: string; attributes: PatreonTierAttributes }
  | { type: string; id: string; attributes: Record<string, unknown> }

type PatreonMembershipResponse = {
  data: {
    id: string
    type: 'member'
    attributes: PatreonMemberAttributes
    relationships: {
      currently_entitled_tiers: { data: { id: string; type: 'tier' }[] }
    }
  }[]
  included: PatreonIncluded[]
}

type PatreonIdentityResponse = {
  data: {
    id: string
    attributes: { full_name: string; email: string }
  }
  included: PatreonIncluded[]
}

// ─── Step 3: Fetch identity + membership ─────────────────────────────────────
export type PatreonUser = {
  patreonId: string
  name:      string
  email:     string
  tier:      PatreonTier | null
  isActive:  boolean
}

export async function fetchPatreonUser(accessToken: string): Promise<PatreonUser> {
  const campaignId = getCampaignId()

  // Fetch identity with memberships included
  const identityUrl = new URL(`${PATREON_API}/identity`)
  identityUrl.searchParams.set(
    'fields[user]',
    'full_name,email',
  )
  identityUrl.searchParams.set('include', 'memberships')
  identityUrl.searchParams.set('fields[member]', 'patron_status,currently_entitled_amount_cents')
  identityUrl.searchParams.set('fields[tier]', 'title,amount_cents')

  const res = await fetch(identityUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    throw new Error(`Patreon identity fetch failed: ${res.status}`)
  }

  const identity = await res.json() as PatreonIdentityResponse
  const { id: patreonId, attributes: { full_name: name, email } } = identity.data

  // Fetch membership for this campaign specifically
  const memberUrl = new URL(`${PATREON_API}/campaigns/${campaignId}/members`)
  memberUrl.searchParams.set('include', 'currently_entitled_tiers,user')
  memberUrl.searchParams.set('fields[member]', 'patron_status,currently_entitled_amount_cents')
  memberUrl.searchParams.set('fields[tier]', 'title,amount_cents')
  memberUrl.searchParams.set('filter[user_id]', patreonId)
  memberUrl.searchParams.set('page[count]', '1')

  const memberRes = await fetch(memberUrl.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.PATREON_CREATOR_ACCESS_TOKEN!}`,
    },
  })

  if (!memberRes.ok) {
    // Not a member — still valid user, just no active membership
    return { patreonId, name, email, tier: null, isActive: false }
  }

  const membership = await memberRes.json() as PatreonMembershipResponse

  if (!membership.data.length) {
    return { patreonId, name, email, tier: null, isActive: false }
  }

  const member = membership.data[0]
  const isActive = member.attributes.patron_status === 'active_patron'
  const cents    = member.attributes.currently_entitled_amount_cents

  // Map Patreon amount to internal tier
  // Adjust these thresholds to match your actual tier pricing
  let tier: PatreonTier | null = null
  if (isActive && cents > 0) {
    if (cents >= 2000)      tier = 'inner_circle'  // $20+
    else if (cents >= 1000) tier = 'insider'        // $10+
    else                    tier = 'supporter'      // $1+
  }

  return { patreonId, name, email, tier, isActive }
}
