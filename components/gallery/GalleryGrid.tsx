'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { GalleryItem } from '@/sanity/lib/queries'

type GalleryGridItem = GalleryItem & {
  thumbUrl: string
  fullUrl:  string
  lqip:     string
  width:    number
  height:   number
}

interface GalleryGridProps {
  images: GalleryGridItem[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openAt  = (i: number) => setLightboxIndex(i)
  const close   = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, prev, next])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const active = lightboxIndex !== null ? images[lightboxIndex] : null

  return (
    <>
      {/*
        CSS masonry — columns: 2 on mobile, 3 on md, 4 on lg
        Each image breaks inside the column flow naturally.
      */}
      <div
        className="columns-2 gap-4 md:columns-3 lg:columns-4"
        style={{ columnFill: 'balance' }}
      >
        {images.map((img, i) => (
          <button
            key={img._key}
            onClick={() => openAt(i)}
            className="group mb-4 block w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            aria-label={`Open ${img.caption ?? img.image.alt} in lightbox`}
          >
            <div className="relative overflow-hidden">
              <Image
                src={img.thumbUrl}
                alt={img.image.alt}
                width={img.width}
                height={img.height}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL={img.lqip}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end bg-navy/0 p-3 transition-all duration-300 group-hover:bg-navy/50">
                {img.caption && (
                  <p className="translate-y-2 font-sans text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 line-clamp-2">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────── */}
      {active !== null && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox — ${active.caption ?? active.image.alt}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 backdrop-blur-sm"
          onClick={close}
        >
          {/* Inner — stop propagation so clicking image doesn't close */}
          <div
            className="relative flex max-h-[90vh] max-w-5xl flex-col items-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.fullUrl}
              alt={active.image.alt}
              width={active.width}
              height={active.height}
              className="max-h-[80vh] max-w-full rounded-sm object-contain"
              sizes="90vw"
              priority
            />

            {/* Caption */}
            {active.caption && (
              <p className="mt-4 text-center font-sans text-sm italic text-white/60">
                {active.caption}
                {active.dateTaken && (
                  <span className="ml-2 not-italic text-white/30">— {active.dateTaken}</span>
                )}
              </p>
            )}

            {/* Counter */}
            <p className="mt-2 font-sans text-xs text-white/30">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
