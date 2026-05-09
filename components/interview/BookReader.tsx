'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PortableText } from '@portabletext/react'
import type { InterviewFull, StoryBodyBlock, PullQuote, StoryImage, Divider, FactBox } from '@/sanity/lib/queries'


interface BookReaderProps {
  interview: InterviewFull
}

// ── Minimal portable text components for the reader ──────────────────────────
const readerComponents = {
  types: {
    pullQuote:  ({ value }: { value: PullQuote }) => (
      <blockquote className="my-8 border-l-4 border-gold pl-6 not-prose">
        <p className="font-serif text-xl italic leading-snug text-navy dark:text-cream">
          &ldquo;{value.quote}&rdquo;
        </p>
        {value.attribution && (
          <cite className="mt-3 block font-sans text-xs uppercase tracking-widest text-gold not-italic">
            {value.attribution}
          </cite>
        )}
      </blockquote>
    ),
    storyImage: ({ value }: { value: StoryImage }) => (
      value.caption ? (
        <p className="my-4 text-center font-sans text-xs italic text-muted not-prose">
          [Image: {value.caption}]
        </p>
      ) : null
    ),
    divider: ({ value }: { value: Divider }) => (
      <div className="not-prose my-10 flex items-center gap-5">
        <div className="h-px flex-1 bg-border" />
        <span className="font-serif text-gold text-lg">{value.label ?? '✦'}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    ),
    factBox: ({ value }: { value: FactBox }) => (
      <aside className="not-prose my-8 rounded-sm border border-gold/30 bg-gold/5 px-5 py-4">
        {value.heading && (
          <p className="mb-2 font-sans text-xs uppercase tracking-widest text-gold font-semibold">
            {value.heading}
          </p>
        )}
        <p className="font-sans text-sm leading-relaxed">{value.body}</p>
      </aside>
    ),
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 font-serif text-[1.15rem] leading-[1.9] text-foreground/90">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-3 mt-12 font-serif text-2xl italic font-normal text-navy dark:text-cream">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-2 mt-8 font-sans text-xs uppercase tracking-widest text-gold font-semibold">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="font-serif italic">{children}</em>
    ),
  },
}

// ── Font size options ─────────────────────────────────────────────────────────
const FONT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl'] as const
type FontSizeClass = typeof FONT_SIZES[number]

// ── Main component ────────────────────────────────────────────────────────────
export default function BookReader({ interview }: BookReaderProps) {
  const [isOpen,     setIsOpen]     = useState(false)
  const [fontSize,   setFontSize]   = useState<FontSizeClass>('text-base')
  const [isDark,     setIsDark]     = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  // Lock body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reading progress
  useEffect(() => {
    if (!isOpen) return
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const pct = el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0
      setProgress(pct)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isOpen])

  // Keyboard shortcuts inside reader
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape') setIsOpen(false)
    if (e.key === '+' || e.key === '=') {
      setFontSize((f) => {
        const i = FONT_SIZES.indexOf(f)
        return FONT_SIZES[Math.min(i + 1, FONT_SIZES.length - 1)]
      })
    }
    if (e.key === '-') {
      setFontSize((f) => {
        const i = FONT_SIZES.indexOf(f)
        return FONT_SIZES[Math.max(i - 1, 0)]
      })
    }
  }, [isOpen])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ── PDF Download ────────────────────────────────────────────────────────────
  async function downloadPDF() {
    setIsDownloading(true)
    setDownloadError('')
    try {
      const res = await fetch(`/api/interview/${interview.slug.current}/pdf`)
      if (!res.ok) {
        const { message } = await res.json() as { message?: string }
        throw new Error(message ?? 'Failed to generate PDF')
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `kafuidey-${interview.guest.toLowerCase().replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'PDF download failed')
    } finally {
      setIsDownloading(false)
    }
  }

  const bgClass   = isDark ? 'bg-[#0B0F1A] text-[#E8E2D9]' : 'bg-[#F5F0E8] text-[#2C2C2A]'
  const panelBg   = isDark ? 'bg-[#141922] border-white/10' : 'bg-[#EDE8E0] border-black/10'
  const btnBase   = 'flex items-center justify-center rounded-sm transition-colors'

  return (
    <>
      {/* ── Trigger buttons on the story page ──────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Read as Book */}
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:border-gold hover:text-gold"
          aria-label="Open book reader"
        >
          <BookIcon />
          Read as Book
        </button>

        {/* Download PDF */}
        <button
          onClick={downloadPDF}
          disabled={isDownloading || interview.isPatreonOnly}
          title={interview.isPatreonOnly ? 'Available to Patreon members only' : 'Download PDF'}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75"/>
            </svg>
          ) : <DownloadIcon />}
          {isDownloading ? 'Generating…' : 'Download PDF'}
        </button>

        {downloadError && (
          <p role="alert" className="font-sans text-xs text-red-500">{downloadError}</p>
        )}
      </div>

      {/* ── Full-screen Book Reader ─────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Book reader: ${interview.title}`}
          className={`fixed inset-0 z-[60] flex flex-col ${bgClass} transition-colors duration-200`}
        >
          {/* Reading progress bar */}
          <div
            className="absolute top-0 left-0 h-[2px] bg-gold transition-all duration-150"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />

          {/* ── Toolbar ────────────────────────────────────────── */}
          <div className={`flex h-12 shrink-0 items-center justify-between border-b px-4 sm:px-6 ${panelBg}`}>
            {/* Left — title */}
            <p className="font-serif text-sm italic truncate max-w-xs opacity-70">
              {interview.guest} — {interview.title}
            </p>

            {/* Right — controls */}
            <div className="flex items-center gap-1">
              {/* Font size down */}
              <button
                onClick={() => setFontSize((f) => FONT_SIZES[Math.max(FONT_SIZES.indexOf(f) - 1, 0)])}
                aria-label="Decrease font size"
                className={`${btnBase} h-8 w-8 font-sans text-lg opacity-60 hover:opacity-100`}
              >
                A
              </button>
              {/* Font size up */}
              <button
                onClick={() => setFontSize((f) => FONT_SIZES[Math.min(FONT_SIZES.indexOf(f) + 1, FONT_SIZES.length - 1)])}
                aria-label="Increase font size"
                className={`${btnBase} h-8 w-8 font-sans text-xl opacity-60 hover:opacity-100`}
              >
                A
              </button>

              {/* Divider */}
              <div className="mx-2 h-4 w-px bg-current opacity-20" />

              {/* Dark / Light toggle */}
              <button
                onClick={() => setIsDark((d) => !d)}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`${btnBase} h-8 w-8 opacity-60 hover:opacity-100`}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* PDF download */}
              <button
                onClick={downloadPDF}
                disabled={isDownloading || interview.isPatreonOnly}
                aria-label="Download PDF"
                className={`${btnBase} h-8 w-8 opacity-60 hover:opacity-100 disabled:opacity-30`}
              >
                <DownloadIcon />
              </button>

              {/* Divider */}
              <div className="mx-2 h-4 w-px bg-current opacity-20" />

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close reader (Escape)"
                className={`${btnBase} h-8 w-8 opacity-60 hover:opacity-100`}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* ── Scrollable story content ──────────────────────── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
          >
            <div className={`mx-auto max-w-[68ch] px-4 py-12 sm:px-8 sm:py-16 ${fontSize}`}>
              {/* Chapter header */}
              <header className="mb-10 pb-8 border-b border-current border-opacity-10">
                {interview.category && (
                  <div className="mb-3">
                    <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>
                      {interview.category}
                    </span>
                  </div>
                )}
                <h1 className="font-serif text-3xl italic font-normal leading-tight mb-4 sm:text-4xl">
                  {interview.title}
                </h1>
                <p className="font-sans text-xs uppercase tracking-widest opacity-50">
                  {interview.guest}
                  {interview.guestTitle && ` — ${interview.guestTitle}`}
                </p>
              </header>

              {/* Opening quote */}
              {interview.openingQuote && (
                <blockquote className="mb-10 pb-10 border-b border-current border-opacity-10">
                  <p className="font-serif text-xl italic leading-snug" style={{ color: isDark ? '#E8E2D9' : NAVY }}>
                    &ldquo;{interview.openingQuote}&rdquo;
                  </p>
                  {interview.openingQuoteAttrib && (
                    <cite className="mt-4 block font-sans text-xs uppercase tracking-widest not-italic" style={{ color: GOLD }}>
                      {interview.openingQuoteAttrib}
                    </cite>
                  )}
                </blockquote>
              )}

              {/* Story body */}
              {interview.storyBody?.length > 0 ? (
                <div className="reader-body">
                  <PortableText
                    value={interview.storyBody as Parameters<typeof PortableText>[0]['value']}
                    components={readerComponents}
                  />
                </div>
              ) : (
                <p className="font-sans text-sm opacity-50 italic">Full transcript coming soon.</p>
              )}

              {/* End ornament */}
              <div className="mt-16 mb-8 flex items-center gap-5">
                <div className="h-px flex-1 opacity-20 bg-current" />
                <span className="font-serif text-2xl" style={{ color: GOLD }}>✦</span>
                <div className="h-px flex-1 opacity-20 bg-current" />
              </div>
              <p className="text-center font-sans text-xs uppercase tracking-widest opacity-30 pb-8">
                kafuideyinterviews.com
              </p>
            </div>
          </div>

          {/* ── Keyboard hint ─────────────────────────────────── */}
          <div className={`shrink-0 border-t px-6 py-2 ${panelBg}`}>
            <p className="text-center font-sans text-[10px] opacity-30 tracking-wider">
              ESC to close &nbsp;·&nbsp; +/− to adjust font size
            </p>
          </div>
        </div>
      )}
    </>
  )
}

// ── Icon components ───────────────────────────────────────────────────────────

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

const GOLD = '#C9A84C'
const NAVY = '#0B0F1A'