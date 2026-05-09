'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const VIDEOS = [
  { id: 'lV-MwOSp9ck', title: 'Kafui Dey Interview' },
  { id: 'yyQmEyPJ-WM', title: 'Kafui Dey Interview' },
  { id: 'jzMzTkGRzoI', title: 'Kafui Dey Interview' },
  { id: 'JEmhKwewtlw', title: 'Kafui Dey Interview' },
  // Add more video IDs here as needed
]

function VideoCard({ id, title, visible, delay, priority }: { id: string; title: string; visible: boolean; delay: number; priority?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const thumbUrl = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`

  return (
    <div
      className={`shrink-0 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
      }`}
      style={{
        transitionDelay: visible ? `${delay}ms` : '0ms',
        scrollSnapAlign: 'start',
        width: 'min(360px, 80vw)',
      }}
    >
      {playing ? (
        <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative w-full overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
          aria-label={`Play: ${title}`}
        >
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <Image
              src={thumbUrl}
              alt={`Thumbnail for ${title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 80vw, 360px"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
              }}
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-navy/30 transition-opacity duration-300 group-hover:bg-navy/10" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="#FF0000"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}

export default function YouTubeSection() {
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
    el.scrollBy({ left: dir === 'right' ? 380 : -380, behavior: 'smooth' })
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header sentinel */}
        <div ref={sentinel} className="mb-10 flex items-center gap-4">
          <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Watch on YouTube
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
              Conversations,<br className="hidden sm:block" /> now on screen
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-foreground/60">
              Watch the latest Kafui Dey Interviews — available on YouTube.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@KafuiDey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-sm bg-[#FF0000] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#cc0000] hover:shadow-[0_8px_24px_rgba(255,0,0,0.3)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
            Subscribe
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
            {VIDEOS.map(({ id, title }, i) => (
              <VideoCard
                key={`${id}-${i}`}
                id={id}
                title={title}
                visible={visible}
                delay={i * 150}
                priority={i === 0}
              />
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

        {/* More videos CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://www.youtube.com/@KafuiDey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-gold transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_6px_20px_rgba(201,168,76,0.25)]"
          >
            More Videos on YouTube
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
