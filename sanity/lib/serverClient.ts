import 'server-only'
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion, client } from './client'

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
