import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found — Kafui Dey',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        404
      </p>
      <h1 className="mt-6 font-serif text-5xl font-normal italic leading-tight text-navy dark:text-cream sm:text-6xl md:text-7xl">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-foreground/50">
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
          className="rounded-sm border border-border px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
        >
          Browse Interviews
        </Link>
      </div>
    </div>
  )
}
