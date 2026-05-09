import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { InterviewCard } from '@/sanity/lib/queries'

interface InterviewCardProps {
  interview: InterviewCard
  priority?: boolean
  /** When true, renders as a wide 2-column landscape hero card */
  featured?: boolean
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// YouTube play icon (red)
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.47A3.01 3.01 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.47a3.01 3.01 0 0 0 2.12-2.13A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" />
    </svg>
  )
}

// Spotify logo (green)
function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.516 17.31a.748.748 0 0 1-1.03.25c-2.818-1.723-6.365-2.113-10.54-1.157a.748.748 0 1 1-.334-1.458c4.573-1.045 8.491-.595 11.654 1.336a.748.748 0 0 1 .25 1.03Zm1.472-3.274a.936.936 0 0 1-1.286.308c-3.225-1.98-8.144-2.554-11.96-1.398a.935.935 0 1 1-.543-1.79c4.363-1.325 9.786-.682 13.482 1.595a.936.936 0 0 1 .307 1.285Zm.126-3.407c-3.868-2.298-10.246-2.51-13.94-1.389a1.122 1.122 0 1 1-.651-2.147c4.244-1.288 11.296-1.039 15.75 1.607a1.122 1.122 0 0 1-1.16 1.929Z" />
    </svg>
  )
}

export default function InterviewCardComponent({ interview, priority, featured }: InterviewCardProps) {
  const { title, guest, guestTitle, excerpt, slug, coverImage, publishedAt, category, tags, isPatreonOnly, duration, youtubeUrl, youtubeId, spotifyEpisodeId } = interview

  const youtubeLink = youtubeUrl ?? (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined)
  const spotifyLink = spotifyEpisodeId ? `https://open.spotify.com/episode/${spotifyEpisodeId}` : undefined

  if (featured) {
    // ── Wide 2×1 featured card (landscape) ────────────────────────────────
    const imgUrl = urlFor(coverImage).width(1200).height(600).quality(85).url()
    return (
      <article className="group grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-sm border border-border bg-white dark:bg-navy/10 hover:border-gold/40 transition-colors">
        {/* Image — left half */}
        <Link href={`/interviews/${slug.current}`} className="block overflow-hidden">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full min-h-[220px] overflow-hidden bg-navy/10">
            <Image
              src={imgUrl}
              alt={coverImage.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={priority}
              placeholder="blur"
              blurDataURL={coverImage?.asset?.metadata?.lqip ?? ''}
            />
            {isPatreonOnly && (
              <div className="absolute top-3 right-3 rounded-sm bg-gold px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-navy">
                Members
              </div>
            )}
            {duration && (
              <div className="absolute bottom-3 left-3 rounded-sm bg-black/60 px-2 py-0.5 font-sans text-xs text-white backdrop-blur-sm">
                {duration}
              </div>
            )}
          </div>
        </Link>

        {/* Content — right half */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            {category && (
              <div className="mb-3">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
                  {category}
                </span>
              </div>
            )}
            <Link href={`/interviews/${slug.current}`}>
              <h2 className="font-serif text-2xl sm:text-3xl italic leading-snug text-navy dark:text-cream transition-colors group-hover:text-gold">
                {title}
              </h2>
            </Link>
            <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-wider text-muted">
              {guest}
              {guestTitle && <span className="font-normal normal-case tracking-normal"> — {guestTitle}</span>}
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-foreground/70 line-clamp-4">
              {excerpt}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <time className="font-sans text-xs text-muted" dateTime={publishedAt}>
              {formatDate(publishedAt)}
            </time>
            <div className="flex items-center gap-3">
              {youtubeLink && (
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-sans text-xs font-semibold text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 transition-colors"
                  aria-label="Watch on YouTube"
                >
                  <YouTubeIcon />
                  YouTube
                </a>
              )}
              {spotifyLink && (
                <a
                  href={spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-sans text-xs font-semibold text-[#1DB954] hover:border-[#1DB954]/40 hover:bg-[#1DB954]/5 transition-colors"
                  aria-label="Listen on Spotify"
                >
                  <SpotifyIcon />
                  Spotify
                </a>
              )}
              <Link
                href={`/interviews/${slug.current}`}
                className="font-sans text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold/70 transition-colors"
              >
                Read Story →
              </Link>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // ── Standard grid card ─────────────────────────────────────────────────────
  const imgUrl = urlFor(coverImage).width(720).height(480).quality(80).url()

  return (
    <article className="group flex flex-col">
      {/* Thumbnail */}
      <Link href={`/interviews/${slug.current}`} className="block overflow-hidden rounded-sm">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-navy/10">
          <Image
            src={imgUrl}
            alt={coverImage.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            placeholder="blur"
            blurDataURL={coverImage?.asset?.metadata?.lqip ?? ''}
          />
          {isPatreonOnly && (
            <div className="absolute top-3 right-3 rounded-sm bg-gold px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-navy">
              Members
            </div>
          )}
          {duration && (
            <div className="absolute bottom-3 left-3 rounded-sm bg-black/60 px-2 py-0.5 font-sans text-xs text-white backdrop-blur-sm">
              {duration}
            </div>
          )}
        </div>
      </Link>

      {/* Meta */}
      <div className="mt-4 flex flex-col flex-1">
        {category && (
          <div className="mb-2">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
              {category}
            </span>
          </div>
        )}

        <Link href={`/interviews/${slug.current}`}>
          <h2 className="font-serif text-xl italic leading-snug text-navy dark:text-cream transition-colors group-hover:text-gold">
            {title}
          </h2>
        </Link>

        <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-wider text-muted">
          {guest}
          {guestTitle && <span className="font-normal normal-case tracking-normal"> — {guestTitle}</span>}
        </p>

        <p className="mt-3 font-sans text-sm leading-relaxed text-foreground/70 line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <time className="font-sans text-xs text-muted" dateTime={publishedAt}>
            {formatDate(publishedAt)}
          </time>
          <div className="flex items-center gap-2">
            {youtubeLink && (
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0000] hover:opacity-70 transition-opacity"
                aria-label="Watch on YouTube"
              >
                <YouTubeIcon />
              </a>
            )}
            {spotifyLink && (
              <a
                href={spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1DB954] hover:opacity-70 transition-opacity"
                aria-label="Listen on Spotify"
              >
                <SpotifyIcon />
              </a>
            )}
            <Link
              href={`/interviews/${slug.current}`}
              className="font-sans text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold/70 transition-colors"
            >
              Read Story →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
