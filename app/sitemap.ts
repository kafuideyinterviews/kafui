import type { MetadataRoute } from 'next'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://kafuideyinterviews.com'

const STATIC_ROUTES: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { url: '/',             priority: 1.0, changeFrequency: 'daily' },
  { url: '/interviews',   priority: 0.9, changeFrequency: 'daily' },
  { url: '/about',        priority: 0.8, changeFrequency: 'monthly' },
  { url: '/gallery',      priority: 0.7, changeFrequency: 'weekly' },
  { url: '/testimonials', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/members',      priority: 0.6, changeFrequency: 'monthly' },
  { url: '/contact',      priority: 0.5, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sanity = createClient({
    projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn:     true,
  })

  const interviews: { slug: { current: string }; publishedAt: string }[] = await sanity.fetch(
    `*[_type == "interview"] | order(publishedAt desc) { slug, publishedAt }`,
  )

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url:             `${BASE_URL}${url}`,
    lastModified:    new Date(),
    changeFrequency,
    priority,
  }))

  const interviewEntries: MetadataRoute.Sitemap = interviews.map((i) => ({
    url:             `${BASE_URL}/interviews/${i.slug.current}`,
    lastModified:    new Date(i.publishedAt),
    changeFrequency: 'weekly',
    priority:        0.8,
  }))

  return [...staticEntries, ...interviewEntries]
}
