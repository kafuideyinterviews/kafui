'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings, HeroSlide } from '@/sanity/lib/queries'

interface HeroSectionProps {
  settings: SiteSettings
}

const SLIDE_DURATION = 6000 // ms per slide

// ── Single slide background ───────────────────────────────────────────────────
function SlideMedia({
  slide,
  active,
  preload,
}: {
  slide: HeroSlide
  active: boolean
  preload: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Play/pause video depending on active state
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [active])

  const imgUrl = slide.type === 'image' && slide.image
    ? `${slide.image.asset.url}?w=1800&q=80&fit=crop&crop=focalpoint&fp-y=0.25`
    : slide.videoPoster
      ? `${slide.videoPoster.asset.url}?w=1800&q=70`
      : null

  return (
    <div
      className={[
        'absolute inset-0 transition-opacity duration-1000',
        active ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      aria-hidden={!active}
    >
      {slide.type === 'video' && slide.videoUrl ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload={preload ? 'auto' : 'none'}
          poster={imgUrl ?? undefined}
          className="h-full w-full object-cover object-[center_20%]"
        >
          <source src={slide.videoUrl} type="video/mp4" />
        </video>
      ) : imgUrl ? (
        <Image
          src={imgUrl}
          alt={slide.image?.alt ?? 'Kafui Dey'}
          fill
          className="object-cover object-[center_20%]"
          priority={active}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={slide.image?.asset?.metadata?.lqip ?? ''}
        />
      ) : (
        <div className="h-full w-full bg-navy" />
      )}
    </div>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function HeroSection({ settings }: HeroSectionProps) {
  const slides   = settings.heroSlides ?? []
  const total    = slides.length

  const [current,  setCurrent]  = useState(0)
  const [paused,   setPaused]   = useState(false)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bioRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLButtonElement>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Auto-advance ────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(total, 1))
  }, [total])

  useEffect(() => {
    if (paused || total <= 1) return
    timerRef.current = setTimeout(advance, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, advance, total])

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrent(i)
  }
  const prev = () => goTo((current - 1 + Math.max(total, 1)) % Math.max(total, 1))
  const next = () => goTo((current + 1) % Math.max(total, 1))

  // ── GSAP entrance ───────────────────────────────────────────────────────
  useEffect(() => {
    let ctx: { revert?: () => void } = {}
    ;(async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.4 })
          .fromTo(bioRef.current,      { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
          .fromTo(ctaRef.current,      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
          .fromTo(scrollRef.current,   { opacity: 0 },        { opacity: 1, duration: 0.6 },        '-=0.2')
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top', end: 'bottom bottom',
          onUpdate: (self) => {
            if (headlineRef.current)
              headlineRef.current.style.transform = `translateY(${self.progress * 60}px)`
          },
        })
      })
    })()
    return () => { ctx.revert?.() }
  }, [])

  return (
    <section
      className="relative flex min-h-screen items-end overflow-hidden"
      aria-label="Hero section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds ──────────────────────────────────── */}
      {total > 0 ? (
        slides.map((slide, i) => (
          <SlideMedia
            key={slide._key}
            slide={slide}
            active={i === current}
            preload={i === 0 || i === current}
          />
        ))
      ) : (
        /* No slides added yet — plain navy fallback */
        <div className="absolute inset-0 bg-navy" />
      )}

      {/* ── Gradient scrim ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/50 to-transparent" />

      {/* ── Arrow navigation ──────────────────────────────────── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/3 z-20 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all hover:border-gold hover:bg-black/40 hover:text-gold sm:left-8"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/3 z-20 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all hover:border-gold hover:bg-black/40 hover:text-gold sm:right-8"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* ── Dot indicators + slide type badge ─────────────────── */}
      {total > 1 && (
        <div
          className="absolute bottom-24 right-6 z-20 flex flex-col items-end gap-2 sm:right-10"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((slide, i) => (
            <button
              key={slide._key}
              role="tab"
              aria-selected={i === current}
              aria-label={slide.caption ?? `Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="group flex items-center gap-2"
            >
              {/* Label on hover */}
              {slide.caption && (
                <span className="hidden font-sans text-[10px] uppercase tracking-widest text-white/40 transition-opacity group-hover:opacity-100 sm:block opacity-0">
                  {slide.caption}
                </span>
              )}
              {/* Media type indicator */}
              <span className="text-white/30 text-[10px]" aria-hidden="true">
                {slide.type === 'video' ? '▶' : '◼'}
              </span>
              {/* Dot */}
              <div
                className={[
                  'rounded-full transition-all duration-300',
                  i === current
                    ? 'h-2 w-6 bg-gold'
                    : 'h-2 w-2 bg-white/30 hover:bg-white/60',
                ].join(' ')}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress bar for current slide ────────────────────── */}
      {total > 1 && !paused && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
          <div
            key={current}
            className="h-full bg-gold origin-left"
            style={{
              animation: `slideProgress ${SLIDE_DURATION}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Kafui Dey Interviews
          </p>

          <h1
            ref={headlineRef}
            className="font-serif text-5xl font-normal italic leading-tight text-white opacity-0 sm:text-6xl md:text-7xl"
          >
            {settings.heroHeadline ?? 'Conversations That Matter'}
          </h1>

          <p
            ref={bioRef}
            className="mt-6 max-w-lg font-sans text-base leading-relaxed text-white/65 opacity-0 sm:text-lg"
          >
            {settings.heroBio ??
              "In-depth dialogues with Ghana's most compelling voices — in politics, culture, business, and beyond."}
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
            <Link
              href="/interviews"
              className="rounded-sm bg-gold px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-opacity hover:opacity-85"
            >
              Browse Interviews
            </Link>
            <a
              href={settings.patreonUrl ?? 'https://www.patreon.com/kafuidey'}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-white/30 px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:border-gold hover:text-gold"
            >
              Join Patreon
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <button
        ref={scrollRef}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white/60 transition-colors">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent animate-scrollLine" />
        </div>
      </button>

      {/* ── CSS keyframes ────────────────────────────────────── */}
      <style jsx>{`
        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100%);  opacity: 0; }
        }
        .animate-scrollLine {
          animation: scrollLine 1.6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}