import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { urlFor } from '@/sanity/lib/image'
import { galleryQuery, type GalleryImage } from '@/sanity/lib/queries'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    "A visual chronicle of Kafui Dey's career — from the studio to the field, across two decades of Ghanaian broadcasting.",
  alternates: { canonical: 'https://kafuideyinterviews.com/gallery' },
  openGraph: {
    title: 'Gallery — Kafui Dey',
    description: "A visual chronicle of Kafui Dey's career across two decades.",
    url:      'https://kafuideyinterviews.com/gallery',
    siteName: 'Kafui Dey Interviews',
    images:   [{ url: 'https://kafuideyinterviews.com/og-default.jpg', width: 1200, height: 630 }],
    type:     'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Gallery — Kafui Dey',
    description: "A visual chronicle of Kafui Dey's career.",
    images:      ['https://kafuideyinterviews.com/og-default.jpg'],
  },
}

export const revalidate = 120

const CATEGORY_LABELS: Record<string, string> = {
  on_air:     'On Air',
  events:     'Events',
  interviews: 'Interviews',
  awards:     'Awards',
  bts:        'Behind the Scenes',
  community:  'Community',
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  let images: GalleryImage[] = []
  try {
    images = await sanityFetch<GalleryImage[]>({ query: galleryQuery, tags: ['gallery'] })
  } catch (error) {
    console.error('Gallery page: Sanity fetch failed:', error)
  }

  const categories = Array.from(new Set(images.map((img) => img.category))).sort()

  const filtered = category
    ? images.filter((img) => img.category === category)
    : images

  // Pre-build optimised URLs to pass to the client component
  const imagesWithUrls = filtered.map((img) => ({
    ...img,
    thumbUrl:    urlFor(img.image).width(600).height(600).quality(75).fit('crop').url(),
    fullUrl:     urlFor(img.image).width(1600).quality(85).url(),
    lqip:        img.image?.asset?.metadata?.lqip ?? '',
    width:       img.image?.asset?.metadata?.dimensions?.width ?? 800,
    height:      img.image?.asset?.metadata?.dimensions?.height ?? 800,
  }))

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border pt-24 pb-12 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Visual Archive
        </p>
        <h1 className="font-serif text-5xl italic font-normal text-navy dark:text-cream md:text-6xl">
          Gallery
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          Two decades of broadcasting, interviews, and moments — in frames.
        </p>
      </header>

      {/* ── Category filter ──────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
        aria-label="Gallery categories"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            <a
              href="/gallery"
              className={[
                'shrink-0 rounded-sm px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors',
                !category ? 'bg-gold text-navy' : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/gallery?category=${cat}`}
                className={[
                  'shrink-0 rounded-sm px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors',
                  category === cat ? 'bg-gold text-navy' : 'text-muted hover:text-foreground',
                ].join(' ')}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Gallery grid (client component for lightbox) ──────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {imagesWithUrls.length > 0 ? (
          <GalleryGrid images={imagesWithUrls} />
        ) : (
          <p className="py-24 text-center font-sans text-muted">
            No images in this category yet.
          </p>
        )}
      </div>
    </main>
  )
}
