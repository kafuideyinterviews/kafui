import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Page Not Found — Kafui Dey',
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-navy text-white">
      <Navbar />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-40 text-center">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          404
        </p>
        <h1 className="mt-6 font-serif text-5xl font-normal italic leading-tight text-white sm:text-6xl md:text-7xl">
          Page Not Found
        </h1>
        <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-sm bg-gold px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          >
            Go Home
          </Link>
          <Link
            href="/interviews"
            className="rounded-sm border border-white/30 px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:text-gold hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          >
            Browse Interviews
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
