import { createClient } from 'next-sanity'

export const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3aamk5fl'
export const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
export const apiVersion = '2024-01-01'

// ── CDN client (production reads — fast) ─────────────────────────────────────
// Always use CDN for read operations to avoid authentication requirements
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
