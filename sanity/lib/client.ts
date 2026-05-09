import { createClient } from 'next-sanity'

export const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3aamk5fl'
export const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
export const apiVersion = '2024-01-01'

// ── CDN client (production reads — fast) ─────────────────────────────────────
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})
