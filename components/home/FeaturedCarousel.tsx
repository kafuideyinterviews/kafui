'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { InterviewCard } from '@/sanity/lib/queries'

export default function FeaturedCarousel({ interviews }: { interviews: InterviewCard[] }) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const navigate = useCallback(
    (idx: number) => {
      if (idx === current) return
      setFading(true)
      setTimeout(() => {
        setCurrent(idx)
        setFading(false)
      }, 300)
    },
    [current],
  )

  const prev = useCallback(
    () => navigate((current - 1 + interviews.length) % interviews.length),
    [current, interviews.length, navigate],
  )

  const next = useCallback(
    () => navigate((current + 1) % interviews.length),
    [current, interviews.length, navigate],
  )

  // Auto-advance every 6 seconds; reset timer on manual navigation
  useEffect(() => {
    if (interviews.length <= 1) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next, interviews.length])

  if (!interviews.length) return null

  const slide = interviews[current]

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* ── Header row ─────────────────────────────────────────── */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Featured Interviews
            </p>
            <div className="hidden h-px w-24 bg-border sm:block" />
          </div>

          {/* Arrow controls */}
          {interviews.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous interview"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next interview"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ── Slide content ───────────────────────────────────────── */}
        <div
          className={`grid grid-cols-1 items-center gap-12 transition-opacity duration-300 lg:grid-cols-2 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Image */}
          <Link
            href={`/interviews/${slide.slug.current}`}
            className="group block overflow-hidden rounded-sm"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={urlFor(slide.coverImage).width(900).height(675).quality(85).url()}
                alt={slide.coverImage.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority={current === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={slide.coverImage?.asset?.metadata?.lqip ?? ''}
              />
              <div className="absolute inset-0 bg-navy/20 transition-opacity duration-300 group-hover:bg-navy/10" />
            </div>
          </Link>

          {/* Text */}
          <div>
            {slide.category && (
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                {slide.category}
              </span>
            )}

            <Link href={`/interviews/${slide.slug.current}`}>
              <h2 className="mt-3 font-serif text-4xl italic font-normal leading-tight text-navy transition-colors hover:text-gold dark:text-cream md:text-5xl">
                {slide.title}
              </h2>
            </Link>

            <p className="mt-3 font-sans text-sm font-semibold uppercase tracking-wider text-muted">
              {slide.guest}
              {slide.guestTitle && (
                <span className="font-normal normal-case tracking-normal"> — {slide.guestTitle}</span>
              )}
            </p>

            {slide.openingQuote && (
              <blockquote className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground/70">
                &ldquo;{slide.openingQuote}&rdquo;
              </blockquote>
            )}

            <p className="mt-6 font-sans text-base leading-relaxed text-foreground/70">
              {slide.excerpt}
            </p>

            <Link
              href={`/interviews/${slide.slug.current}`}
              className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest text-gold transition-all hover:gap-3"
            >
              Read the Story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ── Dot indicators ──────────────────────────────────────── */}
        {interviews.length > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {interviews.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-gold' : 'w-1.5 bg-border hover:bg-gold/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
