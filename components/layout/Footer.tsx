import Link from 'next/link'
import Image from 'next/image'
import FooterNav from './FooterNav'
import ScrollToTop from '@/components/ui/ScrollToTop'

const SOCIAL_LINKS = [
  { label: 'YouTube',   href: 'https://www.youtube.com/@kafuideymc',                          icon: 'M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 00-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 001.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 001.9-1.9C22 15.1 22 12 22 12s0-3.1-.4-4.8zm-11.1 7.7V9.1l5.1 2.9-5.1 2.9z' },
  { label: 'Instagram', href: 'https://www.instagram.com/kafuidey/',                          icon: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.3 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.1 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z' },
  { label: 'Twitter/X', href: 'https://twitter.com/KafuiDey',                                 icon: 'M18.9 2h3.1l-6.8 7.8L23 22h-6.3l-4.9-6.4L5.9 22H2.8l7.3-8.3L2 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L6.3 3.7H4.5L17.8 20z' },
  { label: 'LinkedIn',  href: 'https://gh.linkedin.com/in/kafuidey',                          icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'Spotify',   href: 'https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY',       icon: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@kafuidey7',                              icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z' },
  { label: 'Facebook',  href: 'https://web.facebook.com/KafuiDeyHost/',                        icon: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' },
  { label: 'Amazon',    href: 'https://www.amazon.com/stores/author/B00IRHGXIQ',               icon: 'M15.93 17.09c-.16.12-.41.13-.6.05-1.42-1.19-1.67-1.74-2.45-2.87-2.34 2.39-4 3.1-7.04 3.1C3.4 17.37 2 15.57 2 13.32c0-1.7.9-2.85 2.17-3.42 1.1-.5 2.64-.59 3.82-.72.93-.11 2.73-.18 3.4-.59v-.45c0-.66.05-1.44-.33-2.01-.33-.5-.97-.71-1.53-.71-1.04 0-1.97.53-2.19 1.64-.05.24-.24.48-.48.49l-2.68-.29c-.23-.05-.48-.24-.41-.59C4.34 4.05 6.94 3 9.32 3c1.22 0 2.82.33 3.78 1.25 1.22 1.14 1.1 2.66 1.1 4.31v3.9c0 1.17.49 1.69 .94 2.32.16.23.2.5-.01.67l-1.2 1.04v-.4zm-4.6-2.14c.49-.87.47-1.69.47-2.6v-.49c-1.49 0-3.07.32-3.07 2.07 0 .89.46 1.49 1.25 1.49.58 0 1.1-.36 1.35-.97v.5zm6.86 4.06c-2.12 1.55-5.19 2.37-7.84 2.37-3.71 0-7.05-1.37-9.58-3.65-.2-.18-.02-.42.22-.28 2.73 1.59 6.1 2.54 9.58 2.54 2.35 0 4.93-.49 7.31-1.5.36-.15.66.23.31.52z' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-navy text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" aria-label="Kafui Dey — Home">
              <Image
                src="/logo.png"
                alt="Kafui Dey"
                width={400}
                height={160}
                className="h-32 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-center font-sans text-sm leading-relaxed text-white/50 md:text-left">
              Conversations that matter. In-depth interviews with Ghana's most compelling voices,
              told as stories.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 sm:justify-start">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/50 transition-colors hover:text-gold"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
              Explore
            </p>
            <FooterNav />
          </nav>

          {/* Patreon */}
          <div>
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
              Support the Work
            </p>
            <p className="font-sans text-sm leading-relaxed text-white/50">
              Unlock exclusive long-form interviews, early transcripts, and behind-the-scenes
              content by becoming a Patreon member.
            </p>
            <a
              href="https://www.patreon.com/kafuidey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-sm border border-gold/40 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-gold transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
            >
              Join on Patreon
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-6 flex justify-center">
            <ScrollToTop />
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center font-sans text-sm text-white/30 sm:text-left">
            &copy; {year} Kafui Dey. All rights reserved.
          </p>
          <p className="text-center font-sans text-sm text-white/20 sm:text-left">
            Website Developed & Designed by{' '}
            <a
              href="https://celestialwebsolutions.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 transition-colors hover:text-white/50"
            >
              Celestial Web Solutions
            </a>
          </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
