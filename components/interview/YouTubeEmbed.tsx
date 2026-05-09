'use client'

import { useState } from 'react'
import Image from 'next/image'

interface YouTubeEmbedProps {
  videoId: string
  title: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  if (playing) {
    return (
      <div className="relative w-full overflow-hidden rounded-sm" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      aria-label={`Play: ${title}`}
    >
      {/* Thumbnail */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <Image
          src={thumbUrl}
          alt={`Thumbnail for ${title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 75vw"
          priority
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault unavailable
            ;(e.currentTarget as HTMLImageElement).src =
              `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          }}
        />
        {/* Dark scrim */}
        <div className="absolute inset-0 bg-navy/40 transition-opacity duration-300 group-hover:bg-navy/30" />
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold shadow-lg transition-transform duration-300 group-hover:scale-110">
          <svg
            className="ml-1 h-6 w-6 text-navy"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Watch on YouTube label */}
      <span className="absolute bottom-4 right-4 rounded-sm bg-black/60 px-2 py-1 font-sans text-xs text-white backdrop-blur-sm">
        Watch on YouTube
      </span>
    </button>
  )
}
