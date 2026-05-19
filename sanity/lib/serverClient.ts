import 'server-only'
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion, client } from './client'

// ── Preview client (bypasses CDN — sees draft documents) ─────────────────────
// Only use if SANITY_API_TOKEN is available, otherwise fall back to CDN client
const previewClient = process.env.SANITY_API_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn:      false,
      perspective: 'previewDrafts',
      token:       process.env.SANITY_API_TOKEN,
    })
  : client // Fallback to CDN client if no token available

// ── Auto-select client based on Next.js Draft Mode ───────────────────────────
export async function getClient() {
  const draft = await draftMode()
  return draft.isEnabled && process.env.SANITY_API_TOKEN ? previewClient : client
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
