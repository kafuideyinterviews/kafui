'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/types'

const DESKTOP_LINKS = NAV_LINKS // include all links including Home
const LEFT_LINKS  = DESKTOP_LINKS.slice(0, 3) // Home, Interviews, Gallery
const RIGHT_LINKS = DESKTOP_LINKS.slice(3)    // About, Testimonials, Members, Contact

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navBg =
    isHome && !scrolled
      ? 'bg-transparent'
      : 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'

  const linkColor =
    isHome && !scrolled
      ? 'text-white/80 hover:text-white'
      : 'text-gray-700 hover:text-gray-900'

  // logo.jpeg has white bg → multiply blends into light backgrounds
  // logo-black.jpeg has black bg → screen blends into dark/transparent backgrounds
  const logoSrc = '/logo.png'
  const logoBlend = isHome && !scrolled ? 'mix-blend-mode: screen'  : 'mix-blend-mode: multiply'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">

          {/* Left nav links */}
          <nav aria-label="Main navigation left" className="hidden items-center gap-6 md:flex">
            {LEFT_LINKS.map(({ label, href }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors',
                    active ? 'text-gold' : linkColor,
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Center logo */}
          <div className="flex justify-center">
            <Link href="/" aria-label="Kafui Dey — Home">
              <Image
                src={logoSrc}
                alt="Kafui Dey"
                width={800}
                height={320}
                className="h-24 w-auto object-contain transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Right nav links + CTA */}
          <nav aria-label="Main navigation right" className="hidden items-center justify-end gap-6 md:flex">
            {RIGHT_LINKS.map(({ label, href }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors',
                    active ? 'text-gold' : linkColor,
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
            <a
              href="https://www.youtube.com/@kafuideymc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch on YouTube"
              className="inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:opacity-80 hover:shadow-[0_6px_20px_rgba(255,0,0,0.35)]"
            >
              <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
                <rect width="34" height="24" rx="5" fill="#FF0000"/>
                <path d="M22 12L14 7.5V16.5L22 12Z" fill="white"/>
              </svg>
            </a>
          </nav>

          {/* Mobile: hamburger (right side) */}
          <div className="col-start-3 flex justify-end md:hidden">
            <button
              className={`-mr-1 p-2 ${isHome && !scrolled ? 'text-white' : 'text-gray-800'}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`mt-[5px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`mt-[5px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-[55] flex flex-col bg-navy transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        {/* Top bar — logo left, close right */}
        <div className="flex h-20 shrink-0 items-center justify-between px-4">
          <Link href="/" aria-label="Kafui Dey — Home" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="Kafui Dey"
              width={160}
              height={56}
              className="h-14 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="-mr-1 p-2 text-white/60 hover:text-white"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`border-b border-white/10 py-4 font-serif text-2xl italic transition-colors ${
                  active ? 'text-gold' : 'text-white hover:text-gold'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <a
            href="https://patreon.com/KafuiDey?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_fan&utm_content=copyLink"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-sm bg-gold px-6 py-3.5 text-center font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:bg-[#a8893e] hover:text-white"
          >
            Join Patreon
          </a>
        </nav>

        {/* Social icons */}
        <div className="shrink-0 flex flex-wrap items-center gap-5 px-8 pb-6">
          {[
            { label: 'YouTube',   href: 'https://www.youtube.com/@kafuideymc',           icon: 'M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 00-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 001.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 001.9-1.9C22 15.1 22 12 22 12s0-3.1-.4-4.8zm-11.1 7.7V9.1l5.1 2.9-5.1 2.9z' },
            { label: 'Facebook',  href: 'https://web.facebook.com/KafuiDeyHost/',        icon: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' },
            { label: 'Instagram', href: 'https://www.instagram.com/kafuidey/',           icon: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.3 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.1 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z' },
            { label: 'Twitter/X', href: 'https://twitter.com/KafuiDey',                 icon: 'M18.9 2h3.1l-6.8 7.8L23 22h-6.3l-4.9-6.4L5.9 22H2.8l7.3-8.3L2 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L6.3 3.7H4.5L17.8 20z' },
            { label: 'TikTok',    href: 'https://www.tiktok.com/@kafuidey7',            icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z' },
            { label: 'Spotify',   href: 'https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY', icon: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' },
            { label: 'LinkedIn',  href: 'https://gh.linkedin.com/in/kafuidey',           icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            { label: 'Amazon',    href: 'https://www.amazon.com/stores/author/B00IRHGXIQ', icon: 'M15.93 17.09c-.16.12-.41.13-.6.05-1.42-1.19-1.67-1.74-2.45-2.87-2.34 2.39-4 3.1-7.04 3.1C3.4 17.37 2 15.57 2 13.32c0-1.7.9-2.85 2.17-3.42 1.1-.5 2.64-.59 3.82-.72.93-.11 2.73-.18 3.4-.59v-.45c0-.66.05-1.44-.33-2.01-.33-.5-.97-.71-1.53-.71-1.04 0-1.97.53-2.19 1.64-.05.24-.24.48-.48.49l-2.68-.29c-.23-.05-.48-.24-.41-.59C4.34 4.05 6.94 3 9.32 3c1.22 0 2.82.33 3.78 1.25 1.22 1.14 1.1 2.66 1.1 4.31v3.9c0 1.17.49 1.69 .94 2.32.16.23.2.5-.01.67l-1.2 1.04v-.4zm-4.6-2.14c.49-.87.47-1.69.47-2.6v-.49c-1.49 0-3.07.32-3.07 2.07 0 .89.46 1.49 1.25 1.49.58 0 1.1-.36 1.35-.97v.5zm6.86 4.06c-2.12 1.55-5.19 2.37-7.84 2.37-3.71 0-7.05-1.37-9.58-3.65-.2-.18-.02-.42.22-.28 2.73 1.59 6.1 2.54 9.58 2.54 2.35 0 4.93-.49 7.31-1.5.36-.15.66.23.31.52z' },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/40 transition-colors hover:text-gold"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={icon} />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <p className="shrink-0 px-8 pb-8 font-sans text-xs text-white/20">
          &copy; {new Date().getFullYear()} Kafui Dey
        </p>
      </div>
    </>
  )
}
