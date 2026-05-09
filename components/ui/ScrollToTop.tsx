'use client'

export default function ScrollToTop() {
  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-200 hover:bg-gold hover:text-navy active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 10.5L8 5.5L13 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
