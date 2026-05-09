import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { urlFor } from '@/sanity/lib/image'
import { testimonialsQuery, type Testimonial } from '@/sanity/lib/queries'
import YouTubeEmbed from '@/components/interview/YouTubeEmbed'

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Hear what guests, colleagues, and viewers say about their experience with Kafui Dey.',
  alternates: { canonical: 'https://kafuideyinterviews.com/testimonials' },
  openGraph: {
    title: 'Testimonials — Kafui Dey',
    description: 'Words from guests, colleagues, and viewers.',
    url:      'https://kafuideyinterviews.com/testimonials',
    siteName: 'Kafui Dey Interviews',
    images:   [{ url: 'https://kafuideyinterviews.com/og-default.jpg', width: 1200, height: 630 }],
    type:     'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Testimonials — Kafui Dey',
    description: 'Words from guests, colleagues, and viewers.',
    images:      ['https://kafuideyinterviews.com/og-default.jpg'],
  },
}

export const revalidate = 120

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = []
  try {
    testimonials = await sanityFetch<Testimonial[]>({ query: testimonialsQuery, tags: ['testimonials'] })
  } catch (error) {
    console.error('Testimonials page: Sanity fetch failed:', error)
  }

  const featured    = testimonials.filter((t) => t.featured)
  const withVideo   = testimonials.filter((t) => !t.featured && !!t.videoId)
  const textOnly    = testimonials.filter((t) => !t.featured && !t.videoId)

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border pt-24 pb-14 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          In Their Own Words
        </p>
        <h1 className="font-serif text-5xl italic font-normal text-navy dark:text-cream md:text-6xl">
          Testimonials
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          What guests, colleagues, and viewers say about conversations with Kafui Dey.
        </p>
      </header>

      {/* ── Featured testimonials ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="border-b border-border bg-navy">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <FeaturedCard key={t._id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 space-y-20">

        {/* ── Video testimonials ────────────────────────────────── */}
        {withVideo.length > 0 && (
          <section>
            <div className="mb-10 flex items-center gap-4">
              <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Video Testimonials
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {withVideo.map((t) => (
                <VideoTestimonialCard key={t._id} testimonial={t} />
              ))}
            </div>
          </section>
        )}

        {/* ── Divider ───────────────────────────────────────────── */}
        {withVideo.length > 0 && textOnly.length > 0 && (
          <div className="flex items-center gap-5">
            <div className="h-px flex-1 bg-border" />
            <span className="font-serif text-gold text-xl">✦</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* ── Text testimonials grid ───────────────────────────── */}
        {textOnly.length > 0 && (
          <section>
            <div className="mb-10 flex items-center gap-4">
              <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                From Guests & Colleagues
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {textOnly.map((t) => (
                <TextTestimonialCard key={t._id} testimonial={t} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}

// ─── Featured card — dark background, large quote ──────────────────────────

function FeaturedCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col">
      <blockquote className="flex-1">
        <p className="font-serif text-xl italic leading-snug text-white">
          &ldquo;{t.quote}&rdquo;
        </p>
      </blockquote>
      <footer className="mt-8 flex items-center gap-4">
        {t.photo ? (
          <Image
            src={urlFor(t.photo).width(80).height(80).quality(85).fit('crop').url()}
            alt={t.photo.alt}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/30"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-serif text-lg italic text-gold">
            {t.person.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-sans text-sm font-semibold text-white">{t.person}</p>
          <p className="font-sans text-xs text-white/50">{t.role}</p>
        </div>
      </footer>
    </article>
  )
}

// ─── Video testimonial card ─────────────────────────────────────────────────

function VideoTestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col gap-6">
      {t.videoId && (
        <YouTubeEmbed videoId={t.videoId} title={`${t.person} testimonial`} />
      )}
      <div className="flex items-start gap-4">
        {t.photo ? (
          <Image
            src={urlFor(t.photo).width(80).height(80).quality(85).fit('crop').url()}
            alt={t.photo.alt}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 font-serif text-xl italic text-gold">
            {t.person.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-sans text-sm font-semibold text-foreground">{t.person}</p>
          <p className="font-sans text-xs text-muted">{t.role}</p>
          {t.quote && (
            <p className="mt-3 font-sans text-sm leading-relaxed text-foreground/70 line-clamp-3">
              &ldquo;{t.quote}&rdquo;
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Text testimonial card ──────────────────────────────────────────────────

function TextTestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="rounded-sm border border-border p-6 flex flex-col">
      {/* Opening ornament */}
      <p className="mb-4 font-serif text-3xl text-gold/40 leading-none" aria-hidden="true">
        &ldquo;
      </p>
      <blockquote className="flex-1">
        <p className="font-sans text-sm leading-relaxed text-foreground/80">
          {t.quote}
        </p>
      </blockquote>
      <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {t.photo ? (
          <Image
            src={urlFor(t.photo).width(64).height(64).quality(85).fit('crop').url()}
            alt={t.photo.alt}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 font-serif italic text-gold">
            {t.person.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-sans text-xs font-semibold text-foreground">{t.person}</p>
          <p className="font-sans text-xs text-muted">{t.role}</p>
        </div>
      </footer>
    </article>
  )
}
