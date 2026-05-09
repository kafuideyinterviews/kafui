import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, sanityFetch } from '@/sanity/lib/client'
import { urlFor, estimateReadingTime } from '@/sanity/lib/image'
import {
  interviewBySlugQuery,
  relatedInterviewsQuery,
  type InterviewFull,
  type InterviewCard,
} from '@/sanity/lib/queries'
import StoryBody from '@/components/interview/StoryBody'
import YouTubeEmbed from '@/components/interview/YouTubeEmbed'
import BookReader from '@/components/interview/BookReader'
import ReadingProgressBar from '@/components/interview/ReadingProgressBar'
import InterviewCardComponent from '@/components/interview/InterviewCard'
import ShareButtons from '@/components/interview/ShareButtons'

export const revalidate = 60

// ─── generateStaticParams ────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    `*[_type == "interview"]{ slug }`,
  )
  return slugs.map((doc) => ({ slug: doc.slug.current }))
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const interview: InterviewFull | null = await client.fetch(interviewBySlugQuery, { slug })
  if (!interview) return {}

  const ogImage = urlFor(interview.coverImage).width(1200).height(630).quality(85).url()

  return {
    title:       `${interview.seoTitle ?? interview.title} — Kafui Dey`,
    description: interview.seoDescription ?? interview.excerpt,
    openGraph: {
      title:       `${interview.title} — Kafui Dey`,
      description: interview.excerpt,
      images:      [{ url: ogImage, width: 1200, height: 630 }],
      url:         `https://kafuideyinterviews.com/interviews/${slug}`,
      siteName:    'Kafui Dey Interviews',
      type:        'article',
      publishedTime: interview.publishedAt,
    },
    twitter: {
      card:        'summary_large_image',
      title:       interview.title,
      description: interview.excerpt,
      images:      [ogImage],
    },
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function InterviewStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const interview: InterviewFull | null = await client.fetch(interviewBySlugQuery, { slug })
  const related: InterviewCard[] = interview?.category
    ? await sanityFetch<InterviewCard[]>({ query: relatedInterviewsQuery, params: { slug, category: interview.category }, tags: ['interviews'] })
    : []

  if (!interview) notFound()

  const relatedInterviews = related

  const readingMinutes = estimateReadingTime(interview.storyBody)
  const heroUrl        = urlFor(interview.coverImage).width(1600).height(900).quality(85).url()
  const guestPhotoUrl  = interview.guestPhoto
    ? urlFor(interview.guestPhoto).width(160).height(160).quality(85).url()
    : null
  const pageUrl = `https://kafuideyinterviews.com/interviews/${slug}`

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgressBar />

      <article className="min-h-screen bg-background">

        {/* ────────────────────────────────────────────────────
            HERO — Full-viewport cover image with title overlay
        ──────────────────────────────────────────────────── */}
        <header className="relative w-full overflow-hidden" style={{ minHeight: '85vh' }}>
          {/* Background image */}
          <Image
            src={heroUrl}
            alt={interview.coverImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={interview.coverImage?.asset?.metadata?.lqip ?? ''}
          />

          {/* Gradient scrim — bottom-heavy so text always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-0 flex flex-col justify-end">

            {/* Back link — top-left, clears fixed navbar */}
            <div className="absolute top-0 left-0 right-0 px-4 pt-24 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <nav>
                  <Link
                    href="/interviews"
                    className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold/80 hover:text-gold transition-colors"
                  >
                    ← All Interviews
                  </Link>
                </nav>
              </div>
            </div>

            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
              {interview.category && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-sm border border-gold/40 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {interview.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="font-serif text-4xl italic font-normal leading-tight text-white md:text-5xl lg:text-6xl">
                {interview.title}
              </h1>

              {/* Guest byline */}
              <p className="mt-4 font-sans text-base font-semibold uppercase tracking-widest text-gold">
                {interview.guest}
                {interview.guestTitle && (
                  <span className="ml-2 font-normal normal-case tracking-normal text-white/70">
                    — {interview.guestTitle}
                  </span>
                )}
              </p>

              {/* Meta row */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-white/60">
                <time className="font-sans text-sm" dateTime={interview.publishedAt}>
                  {formatDate(interview.publishedAt)}
                </time>
                {readingMinutes > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans text-sm">{readingMinutes} min read</span>
                  </>
                )}
                {interview.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans text-sm">{interview.duration} video</span>
                  </>
                )}
                {interview.isPatreonOnly && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="rounded-sm bg-gold px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-navy">
                      Members Only
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ────────────────────────────────────────────────────
            STORY BODY
        ──────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Opening pull quote — big editorial statement */}
          {interview.openingQuote && (
            <section className="py-14 border-b border-border">
              <blockquote>
                <p className="font-serif text-2xl italic leading-snug text-navy dark:text-cream md:text-3xl lg:text-4xl">
                  &ldquo;{interview.openingQuote}&rdquo;
                </p>
                {interview.openingQuoteAttrib && (
                  <cite className="mt-5 block font-sans text-sm uppercase tracking-[0.2em] text-gold not-italic">
                    {interview.openingQuoteAttrib}
                  </cite>
                )}
              </blockquote>
            </section>
          )}

          {/* Book reader */}
          <BookReader interview={interview} />

          {/* YouTube embed */}
          {interview.youtubeId && (
            <section className="py-10">
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-muted">
                Watch the Interview
              </p>
              <YouTubeEmbed videoId={interview.youtubeId} title={interview.title} />
              {interview.youtubeUrl && (
                <p className="mt-3 text-right">
                  <a
                    href={interview.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-muted hover:text-gold transition-colors"
                  >
                    Open on YouTube ↗
                  </a>
                </p>
              )}
            </section>
          )}

          {/* Story body divider */}
          <div className="flex items-center gap-5 pb-2 pt-4">
            <div className="h-px flex-1 bg-border" />
            <span className="font-serif text-gold text-xl">✦</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* The Story / Transcript */}
          {interview.storyBody?.length > 0 ? (
            <section className="py-10">
              <StoryBody blocks={interview.storyBody} />
            </section>
          ) : (
            <section className="py-16 text-center">
              <p className="font-sans text-muted italic">Full transcript coming soon.</p>
            </section>
          )}

          {/* ── Category + Tags footer ──────────────────── */}
          {(interview.category || (interview.tags && interview.tags.length > 0)) && (
            <footer className="mt-4 mb-16 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <span className="font-sans text-xs text-muted uppercase tracking-widest mr-2">Topics:</span>
              {interview.category && (
                <a
                  href={`/interviews?category=${interview.category}`}
                  className="rounded-sm border border-gold/40 px-3 py-1 font-sans text-xs font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  {interview.category}
                </a>
              )}
              {interview.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border px-3 py-1 font-sans text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </footer>
          )}

          {/* Share */}
          <div className="mb-16 mt-2 border-t border-border pt-8">
            <ShareButtons title={interview.title} url={pageUrl} />
          </div>
        </div>

        {/* ────────────────────────────────────────────────────
            GUEST BIO CARD
        ──────────────────────────────────────────────────── */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              About the Guest
            </p>
            <div className="flex items-start gap-5">
              {guestPhotoUrl ? (
                <Image
                  src={guestPhotoUrl}
                  alt={interview.guestPhoto?.alt ?? interview.guest}
                  width={72}
                  height={72}
                  className="h-18 w-18 flex-shrink-0 rounded-full object-cover ring-2 ring-gold/30"
                />
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 ring-2 ring-gold/20">
                  <span className="font-serif text-2xl italic text-gold">
                    {interview.guest.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-sans text-base font-semibold text-foreground">{interview.guest}</p>
                {interview.guestTitle && (
                  <p className="mt-1 font-sans text-sm text-muted">{interview.guestTitle}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────
            SHARE + PATREON CTA
        ──────────────────────────────────────────────────── */}
        <section className="border-t border-border bg-navy text-white">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 text-center">
            <p className="font-serif text-3xl italic font-normal">Enjoy this conversation?</p>
            <p className="mt-3 font-sans text-sm text-white/60 leading-relaxed max-w-md mx-auto">
              Support Kafui Dey's work and unlock exclusive long-form interviews, early transcripts,
              and behind-the-scenes content.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.patreon.com/kafuidey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-3 font-sans text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              >
                Become a Member on Patreon
              </a>
              <a
                href="/interviews"
                className="font-sans text-sm text-white/60 hover:text-white transition-colors"
              >
                Explore more interviews →
              </a>
            </div>
            <div className="mt-10 flex justify-center">
              <ShareButtons title={interview.title} url={pageUrl} />
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────
            RELATED INTERVIEWS
        ──────────────────────────────────────────────────── */}
        {relatedInterviews.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-center gap-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold shrink-0">
                  You Might Also Like
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {relatedInterviews.map((rel) => (
                  <InterviewCardComponent key={rel._id} interview={rel} />
                ))}
              </div>
            </div>
          </section>
        )}

      </article>
    </>
  )
}
