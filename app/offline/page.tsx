export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center">
      <div className="max-w-md">
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          No Connection
        </p>
        <h1 className="font-serif text-5xl font-normal italic text-white">
          You&rsquo;re offline
        </h1>
        <p className="mt-6 font-sans text-base leading-relaxed text-white/60">
          Please check your internet connection. Interviews and gallery pages you&rsquo;ve visited recently are still available.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-10 rounded-sm bg-gold px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-opacity hover:opacity-85"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}
