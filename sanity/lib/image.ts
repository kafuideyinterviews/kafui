import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3aamk5fl'
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2024-01-01'

// Minimal client for image URL building only — safe for client components
const imageClient = createClient({ projectId, dataset, apiVersion, useCdn: true })
const builder = imageUrlBuilder(imageClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ── Reading time helper ───────────────────────────────────────────────────────
export function estimateReadingTime(storyBody: unknown[]): number {
  if (!Array.isArray(storyBody)) return 0
  let words = 0
  for (const block of storyBody) {
    if (
      block &&
      typeof block === 'object' &&
      '_type' in block &&
      (block as { _type: string })._type === 'block' &&
      'children' in block
    ) {
      const children = (block as { children: { text?: string }[] }).children
      for (const child of children) {
        if (child?.text) words += child.text.trim().split(/\s+/).length
      }
    }
    if (
      block &&
      typeof block === 'object' &&
      '_type' in block &&
      (block as { _type: string })._type === 'pullQuote' &&
      'quote' in block
    ) {
      const q = (block as { quote?: string }).quote
      if (q) words += q.trim().split(/\s+/).length
    }
  }
  return Math.max(1, Math.ceil(words / 200))
}
