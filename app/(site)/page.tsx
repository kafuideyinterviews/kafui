import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { urlFor } from '@/sanity/lib/image'
import {
  siteSettingsQuery,
  featuredCarouselQuery,
  categoryTilesQuery,
  type SiteSettings,
  type InterviewCard,
  type CategoryTile,
} from '@/sanity/lib/queries'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import SpotifySection from '@/components/home/SpotifySection'
import YouTubeSection from '@/components/home/YouTubeSection'
import PatreonWidget from '@/components/home/PatreonWidget'

export const metadata: Metadata = {
  title: 'Kafui Dey — Conversations That Matter',
  description:
    "In-depth interviews with Ghana's most compelling voices in politics, entertainment, business, and culture.",
}

export const revalidate = 60

export default async function HomePage() {
  let settings: SiteSettings | null = null
  let carouselInterviews: InterviewCard[] = []
  let categoryRaw: CategoryTile[] = []

  try {
    ;[settings, carouselInterviews, categoryRaw] = await Promise.all([
      sanityFetch<SiteSettings>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
      sanityFetch<InterviewCard[]>({ query: featuredCarouselQuery, tags: ['interviews'] }),
      sanityFetch<CategoryTile[]>({ query: categoryTilesQuery, tags: ['interviews'] }),
    ])
  } catch (error) {
    console.error('Home page: Sanity fetch failed:', error)
  }

  // Deduplicate: one tile per category (first = most recent cover image)
  const seen = new Set<string>()
  const categoryTiles = categoryRaw.filter(({ category }) => {
    if (seen.has(category)) return false
    seen.add(category)
    return true
  })

  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <HeroSection settings={settings} />

      {/* ── Featured Interviews Carousel ─────────────────────── */}
      <FeaturedCarousel interviews={carouselInterviews} />

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '30+', label: 'Years in Media' },
              { value: '50+', label: 'Interviews Conducted' },
              { value: '3', label: 'Decades of Journalism' },
              { value: 'Ghana', label: 'Based in Accra' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-4xl italic font-normal text-gold">{value}</p>
                <p className="mt-2 font-sans text-xs uppercase tracking-widest text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ──────────────────────────────────── */}
      {categoryTiles.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Browse by Category
                </p>
                <div className="hidden h-px w-24 bg-border sm:block" />
              </div>
              <Link
                href="/interviews"
                className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categoryTiles.map(({ category, coverImage }) => (
                <Link
                  key={category}
                  href={`/interviews?category=${category}`}
                  className="group relative overflow-hidden rounded-sm aspect-[4/3]"
                >
                  <Image
                    src={urlFor(coverImage).width(480).height(360).quality(75).url()}
                    alt={category}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL={coverImage?.asset?.metadata?.lqip ?? ''}
                  />
                  {/* dark scrim */}
                  <div className="absolute inset-0 bg-navy/50 transition-opacity duration-300 group-hover:bg-navy/35" />
                  {/* label */}
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white group-hover:text-gold transition-colors">
                      {category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Spotify ──────────────────────────────────────────────── */}
      <SpotifySection />

      {/* ── Patreon Widget ──────────────────────────────────────── */}
      <PatreonWidget />

      {/* ── YouTube ──────────────────────────────────────────────── */}
      <YouTubeSection />
    </main>
  )
}
