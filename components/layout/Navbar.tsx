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
        <nav className="flex flex-1 flex-col justify-center gap-0 overflow-y-auto px-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`border-b border-white/10 py-5 font-serif text-3xl italic transition-colors ${
                  active ? 'text-gold' : 'text-white hover:text-gold'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <a
            href="https://www.patreon.com/kafuidey"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-sm bg-gold px-6 py-3.5 text-center font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:bg-[#a8893e] hover:text-white"
          >
            Join Patreon
          </a>
        </nav>

        {/* Footer note */}
        <p className="shrink-0 px-8 pb-8 font-sans text-xs text-white/20">
          &copy; {new Date().getFullYear()} Kafui Dey
        </p>
      </div>
    </>
  )
}
