import Image from 'next/image'

const PATREON_URL =
  'https://patreon.com/KafuiDey?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_fan&utm_content=copyLink'

export default function PatreonWidget() {
  return (
    <section className="border-b border-border overflow-hidden">
      {/* Full-width banner — deep crimson like Patreon page */}
      <div className="relative min-h-[420px] md:min-h-[500px] flex items-center bg-gradient-to-br from-[#8B1A2A] via-[#6B0F1A] to-[#3D0A10]">

        {/* Large background logo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 md:pr-24" aria-hidden="true">
          <Image
            src="/logo.png"
            alt=""
            width={600}
            height={400}
            className="h-64 w-auto object-contain opacity-20 md:h-96"
          />
        </div>

        {/* Patreon P — top left */}
        <div className="absolute top-5 left-6">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-label="Patreon">
            <circle cx="20" cy="12" r="10" fill="white" fillOpacity="0.85"/>
            <rect x="2" y="2" width="6" height="28" rx="1" fill="white"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-16 md:px-20">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Support the Work
          </p>
          <h2 className="font-serif text-4xl italic font-normal text-gold md:text-5xl">
            Join Patreon
          </h2>
          <div className="mt-1 h-px w-16 bg-gold/40" />
          <h3 className="mt-5 font-sans text-5xl font-bold text-white md:text-7xl">Kafui Dey</h3>
          <p className="mt-3 font-sans text-base text-white/70">
            Interviewer. Event Host. Speaker.
          </p>
          <p className="mt-1 font-sans text-sm text-white/50">
            Subscribe to my YT Channel{' '}
            <a
              href="https://youtube.com/@kafuideymc"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80 transition-colors"
            >
              youtube.com/@kafuideymc
            </a>
          </p>
          <a
            href={PATREON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-sans text-sm font-semibold text-[#6B0F1A] transition-all duration-200 hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          >
            Join for free
          </a>
          <a
            href="https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-white/30 px-7 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10 ml-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Listen on Spotify
          </a>
        </div>

        {/* Bottom text strip */}
        <div className="absolute bottom-5 left-0 right-0 px-8 md:px-20">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/25">
            Interviewer&nbsp;&nbsp;·&nbsp;&nbsp;Event Host&nbsp;&nbsp;·&nbsp;&nbsp;Speaker
          </p>
        </div>
      </div>
    </section>
  )
}
