'use client'

import { useEffect, useRef, useState } from 'react'

const EPISODES = [
  { id: '4fokESfuwI3Og3qsytHBJC', title: 'Episode 1' },
  { id: '6d43Uo9YrMUOTppdwmko3e', title: 'Episode 2' },
  { id: '2wkV2EatC5Bc9FCsio2nNR', title: 'Episode 3' },
  { id: '3IqiPM1LIpniwj4R3jgmGI', title: 'Episode 4' },
  // Add more episode IDs here as needed
]

export default function SpotifySection() {
  const sentinel = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' })
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header sentinel */}
        <div ref={sentinel} className="mb-10 flex items-center gap-4">
          <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Listen on Spotify
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Top row: text + CTA */}
        <div
          className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div>
            <h2 className="font-serif text-4xl italic font-normal text-navy dark:text-cream md:text-5xl">
              Conversations,<br className="hidden sm:block" /> now streaming
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-foreground/60">
              Catch up on the latest episodes of the Kafui Dey Interviews podcast — available on
              Spotify.
            </p>
          </div>
          <a
            href="https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-sm bg-[#1DB954] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#17a349] hover:shadow-[0_8px_24px_rgba(29,185,84,0.35)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Follow on Spotify
          </a>
        </div>

        {/* Scroll strip */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className={`absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all duration-200 hover:border-gold hover:text-gold ${
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {EPISODES.map(({ id, title }, i) => (
              <div
                key={`${id}-${i}`}
                className={`shrink-0 transition-all duration-700 ease-out ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
                }`}
                style={{
                  transitionDelay: visible ? `${i * 150}ms` : '0ms',
                  scrollSnapAlign: 'start',
                  width: 'min(360px, 80vw)',
                }}
              >
                <iframe
                  src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator`}
                  width="100%"
                  height="232"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: '12px', display: 'block' }}
                  title={`Kafui Dey Interviews — ${title}`}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className={`absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all duration-200 hover:border-gold hover:text-gold ${
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>

        {/* Load More — links to Spotify show */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-gold transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_6px_20px_rgba(201,168,76,0.25)]"
          >
            More Episodes on Spotify
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
