import 'server-only'
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'

export const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3aamk5fl'
export const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2024-01-01'

// ── CDN client (production reads — fast) ─────────────────────────────────────
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// ── Preview client (bypasses CDN — sees draft documents) ─────────────────────
const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn:      false,
  perspective: 'previewDrafts',
  token:       process.env.SANITY_API_TOKEN,
})

// ── Auto-select client based on Next.js Draft Mode ───────────────────────────
export async function getClient() {
  const draft = await draftMode()
  return draft.isEnabled ? previewClient : client
}

// ── Typed fetch helper ────────────────────────────────────────────────────────
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query:   string
  params?: Record<string, unknown>
  tags?:   string[]
}): Promise<T> {
  const c = await getClient()
  return c.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 0 : 60,
      tags,
    },
  })
}
