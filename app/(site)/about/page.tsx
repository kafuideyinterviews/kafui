import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  siteSettingsQuery,
  milestonesQuery,
  type SiteSettings,
  type Milestone,
} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Kafui Dey — veteran Ghanaian journalist, broadcaster, and interviewer with over three decades in media.',
  keywords: [
    'Kafui Dey', 'about Kafui Dey', 'Ghanaian journalist', 'Ghana broadcaster',
    'Joy FM', 'TV3 Ghana', 'GTV Ghana', 'African journalist', 'Kafui Dey biography',
    'Ghana media personality', 'Accra journalist', 'Kafui Dey interviews',
  ],
  alternates: { canonical: 'https://kafuideyinterviews.com/about' },
  openGraph: {
    title:       'About Kafui Dey',
    description: 'Veteran Ghanaian journalist, broadcaster, and interviewer.',
    url:         'https://kafuideyinterviews.com/about',
    siteName:    'Kafui Dey Interviews',
    images:      [{ url: 'https://kafuideyinterviews.com/og-default.jpg', width: 1200, height: 630 }],
    type:        'profile',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'About Kafui Dey',
    description: 'Veteran Ghanaian journalist, broadcaster, and interviewer.',
    images:      ['https://kafuideyinterviews.com/og-default.jpg'],
  },
}

export const revalidate = 120

const bioComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-6 font-sans text-lg leading-[1.9] text-foreground/80">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-12 font-serif text-3xl italic font-normal text-navy dark:text-cream">{children}</h2>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="font-serif italic">{children}</em>
    ),
  },
}

export default async function AboutPage() {
  const [settings, milestones]: [SiteSettings | null, Milestone[]] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(milestonesQuery),
  ])

  const portraitUrl = settings?.aboutPhoto?.asset?.url
    ? urlFor(settings.aboutPhoto).width(800).height(1000).quality(85).fit('crop').url()
    : null

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border pt-24 pb-14 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          The Man Behind the Mic
        </p>
        <h1 className="font-serif text-6xl italic font-normal text-navy dark:text-cream md:text-7xl lg:text-8xl">
          About Kafui Dey
        </h1>
      </header>

      {/* ── Bio section ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:gap-16 lg:grid-cols-[380px_1fr]">
            {/* Portrait */}
            {portraitUrl ? (
              <div className="lg:sticky lg:top-24 mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none overflow-hidden rounded-sm">
                <Image
                  src={portraitUrl}
                  alt={settings?.aboutPhoto?.alt ?? 'Kafui Dey'}
                  width={380}
                  height={475}
                  className="w-full object-cover"
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
                  placeholder="blur"
                  blurDataURL={settings?.aboutPhoto?.asset?.metadata?.lqip ?? ''}
                />
              </div>
            ) : (
              <div className="lg:sticky lg:top-24 mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none flex aspect-[4/5] items-center justify-center rounded-sm bg-navy/5">
                <p className="font-serif text-6xl italic text-navy/20 dark:text-white/10">KD</p>
              </div>
            )}

            {/* Biography */}
            <div>
              <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Biography
              </p>

              {settings?.aboutBio?.length ? (
                <div className="prose-none">
                  <PortableText
                    value={settings?.aboutBio as unknown as Parameters<typeof PortableText>[0]['value']}
                    components={bioComponents}
                  />
                </div>
              ) : (
                // Fallback placeholder — replace via Sanity Studio
                <div className="space-y-6 font-sans text-lg leading-[1.9] text-foreground/80">
                  <p>
                    Kafui Dey is one of Ghana&apos;s most recognised broadcast journalists, with
                    over two decades of experience at the forefront of Ghanaian media. Known for
                    his incisive questioning and ability to draw out candid, revealing conversations,
                    he has sat across from presidents, artists, entrepreneurs, and ordinary citizens
                    whose stories deserve telling.
                  </p>
                  <p>
                    His career has spanned some of Ghana&apos;s most prominent media organisations,
                    including Joy FM, TV3, and GTV. Whether hosting current affairs programmes or
                    conducting in-depth personality interviews, Kafui brings the same discipline and
                    preparation to every conversation.
                  </p>
                  <p>
                    Beyond broadcasting, Kafui is committed to the development of media in Ghana —
                    mentoring young journalists and contributing to discourse on the role of the
                    press in democratic governance.
                  </p>
                </div>
              )}

              {/* Social / Contact links */}
              <div className="mt-10 flex flex-wrap gap-4">
                {settings?.youtubeChannelUrl && (
                  <a
                    href={settings?.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-sm border border-border px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:border-red-500 hover:text-red-500"
                  >
                    <svg width="18" height="13" viewBox="0 0 18 13" fill="currentColor" aria-hidden="true">
                      <path d="M17.6 2.03A2.26 2.26 0 0 0 16.01.42C14.61 0 9 0 9 0S3.39 0 1.99.42A2.26 2.26 0 0 0 .4 2.03 23.6 23.6 0 0 0 0 6.5a23.6 23.6 0 0 0 .4 4.47A2.26 2.26 0 0 0 1.99 12.58C3.39 13 9 13 9 13s5.61 0 7.01-.42a2.26 2.26 0 0 0 1.59-1.61A23.6 23.6 0 0 0 18 6.5a23.6 23.6 0 0 0-.4-4.47zM7.2 9.29V3.71L11.88 6.5 7.2 9.29z"/>
                    </svg>
                    YouTube Channel
                  </a>
                )}
                {settings?.spotifyUrl && (
                  <a
                    href={settings?.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-sm border border-border px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:border-[#1DB954] hover:text-[#1DB954]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Listen on Spotify
                  </a>
                )}
                {settings?.patreonUrl && (
                  <a
                    href={settings?.patreonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-sm bg-gold px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M14.82 2.41C11.55 2.41 8.89 5.07 8.89 8.35c0 3.27 2.66 5.93 5.93 5.93 3.27 0 5.93-2.66 5.93-5.93 0-3.28-2.66-5.94-5.93-5.94zM3.18 21.59h3.1V2.41H3.18v19.18z"/>
                    </svg>
                    Support on Patreon
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Timeline ──────────────────────────────────────── */}
      {milestones.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-14 flex items-center gap-4">
              <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Career Timeline
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>

            <ol className="relative" aria-label="Career timeline">
              {/* Vertical rule */}
              <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border" aria-hidden="true" />

              {milestones.map((m) => (
                <li key={m._id} className="relative mb-12 pl-28 last:mb-0">
                  {/* Year label */}
                  <span className="absolute left-0 top-0 w-16 text-right font-serif text-2xl italic font-normal text-gold">
                    {m.year}
                  </span>

                  {/* Timeline dot */}
                  <div
                    className="absolute left-[68px] top-1 h-2 w-2 rounded-full bg-gold"
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div>
                    <div className="flex items-start gap-4">
                      {/* Organisation logo — bigger and round */}
                      {m.logo && (
                        <div className="mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-sm ring-2 ring-gold/10">
                          <Image
                            src={urlFor(m.logo).width(112).height(112).quality(90).fit('crop').url()}
                            alt={m.logo.alt ?? m.organisation ?? ''}
                            width={56}
                            height={56}
                            className="h-full w-full object-contain p-1.5"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="font-serif text-2xl italic font-normal leading-snug text-navy dark:text-cream">
                          {m.title}
                        </h2>
                        {m.organisation && (
                          <p className="mt-0.5 font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                            {m.organisation}
                          </p>
                        )}
                        {m.description && (
                          <p className="mt-3 font-sans text-base leading-relaxed text-foreground/70">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <p className="font-serif text-3xl italic font-normal text-navy dark:text-cream">
            Explore the Conversations
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
            Browse the full archive of interviews — each one told as a longform story.
          </p>
          <Link
            href="/interviews"
            className="mt-8 inline-block rounded-sm bg-gold px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          >
            Browse Interviews
          </Link>
        </div>
      </section>
    </main>
  )
}