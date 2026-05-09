import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { client } from '@/sanity/lib/client'
import { interviewsListQuery, type InterviewCard } from '@/sanity/lib/queries'
import InterviewCardComponent from '@/components/interview/InterviewCard'
import type { PatreonTier } from '@/types'

export const metadata: Metadata = {
  title: 'Members',
  description:
    'Exclusive interviews and content for Patreon members. Join to unlock full archives, unedited transcripts, and early access.',
  alternates: { canonical: 'https://kafuideyinterviews.com/members' },
  robots: { index: false, follow: false },
  openGraph: {
    title:       'Members — Kafui Dey',
    description: 'Exclusive content for Patreon members.',
    url:         'https://kafuideyinterviews.com/members',
    siteName:    'Kafui Dey Interviews',
    type:        'website',
  },
}

// Never cache — session is per-request
export const dynamic = 'force-dynamic'

const TIERS: {
  id: PatreonTier
  name: string
  price: string
  perks: string[]
}[] = [
  {
    id:    'supporter',
    name:  'Supporter',
    price: '$5 / month',
    perks: [
      'Access to members-only interviews',
      'Full downloadable transcripts',
      'Name in the credits',
    ],
  },
  {
    id:    'insider',
    name:  'Insider',
    price: '$10 / month',
    perks: [
      'Everything in Supporter',
      'Early access — read transcripts before episodes air',
      'Monthly members Q&A',
      'Behind-the-scenes notes from Kafui',
    ],
  },
  {
    id:    'inner_circle',
    name:  'Inner Circle',
    price: '$20 / month',
    perks: [
      'Everything in Insider',
      'Submit questions for upcoming interviews',
      'Private group access',
      'Annual virtual meet with Kafui',
    ],
  },
]

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>
}) {
  const { status, error } = await searchParams
  const session = await getSession()

  // Fetch all interviews to show the locked ones
  const allInterviews: InterviewCard[] = await client.fetch(interviewsListQuery)
  const memberInterviews = allInterviews.filter((i) => i.isPatreonOnly)

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border pt-24 pb-14 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Patreon Members
        </p>
        <h1 className="font-serif text-5xl italic font-normal text-navy dark:text-cream md:text-6xl">
          Go Deeper
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          Exclusive interviews and content — for those who want the full conversation.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">

        {/* ── Status / error banners ───────────────────────────── */}
        {status === 'success' && session && (
          <div
            role="alert"
            className="rounded-sm border border-green-600/30 bg-green-500/10 px-5 py-4 font-sans text-sm text-green-700 dark:text-green-400"
          >
            Welcome, {session.name}! Your Patreon membership has been verified.
            You now have access to all {session.tier.replace('_', ' ')} content.
          </div>
        )}
        {status === 'not_member' && (
          <div
            role="alert"
            className="rounded-sm border border-amber-600/30 bg-amber-500/10 px-5 py-4 font-sans text-sm text-amber-700 dark:text-amber-400"
          >
            Your Patreon account was found but you don&apos;t have an active membership.{' '}
            <a
              href="https://www.patreon.com/kafuidey"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              Join on Patreon
            </a>{' '}
            to unlock member content.
          </div>
        )}
        {(error === 'access_denied' || error === 'state_mismatch') && (
          <div
            role="alert"
            className="rounded-sm border border-red-600/30 bg-red-500/10 px-5 py-4 font-sans text-sm text-red-700 dark:text-red-400"
          >
            The authorisation was cancelled or failed. Please try again.
          </div>
        )}
        {error === 'server_error' && (
          <div
            role="alert"
            className="rounded-sm border border-red-600/30 bg-red-500/10 px-5 py-4 font-sans text-sm text-red-700 dark:text-red-400"
          >
            Something went wrong on our end. Please try again in a few minutes.
          </div>
        )}

        {/* ── Session panel: logged in ─────────────────────────── */}
        {session ? (
          <section className="rounded-sm border border-border p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">{session.name}</p>
                <p className="font-sans text-xs text-muted">{session.email}</p>
                <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                  {session.tier.replace('_', ' ')} member
                  {session.isActive ? '' : ' — inactive'}
                </p>
              </div>
              <a
                href="/api/auth/signout"
                className="mt-4 self-start font-sans text-xs text-muted underline hover:text-foreground transition-colors sm:mt-0 sm:self-auto"
              >
                Sign out
              </a>
            </div>
          </section>
        ) : (
          /* ── Not logged in — Patreon connect CTA ─────────────── */
          <section className="rounded-sm border border-gold/30 bg-gold/5 p-8 text-center">
            <p className="font-serif text-2xl italic font-normal text-navy dark:text-cream">
              Already a Patreon member?
            </p>
            <p className="mt-3 font-sans text-sm text-muted">
              Connect your Patreon account to unlock your member content.
            </p>
            <a
              href="https://www.patreon.com/kafuidey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-sm bg-gold px-8 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            >
              Join on Patreon
            </a>
          </section>
        )}

        {/* ── Tier pricing cards ───────────────────────────────── */}
        <section>
          <div className="mb-10 flex items-center gap-4">
            <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Membership Tiers
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((tier, i) => {
              const isCurrent = session?.tier === tier.id && session.isActive
              const isRecommended = i === 1 // Insider = middle tier

              return (
                <article
                  key={tier.id}
                  className={[
                    'flex flex-col rounded-sm p-6',
                    isCurrent
                      ? 'border-2 border-gold bg-gold/5'
                      : isRecommended
                        ? 'border-2 border-gold/40 bg-background'
                        : 'border border-border bg-background',
                  ].join(' ')}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                        {tier.name}
                      </p>
                      <p className="mt-1 font-serif text-2xl italic font-normal text-navy dark:text-cream">
                        {tier.price}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="rounded-sm bg-gold px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-navy">
                        Active
                      </span>
                    )}
                    {isRecommended && !isCurrent && (
                      <span className="rounded-sm border border-gold/40 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-gold">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Perks */}
                  <ul className="flex-1 space-y-2.5" aria-label={`${tier.name} perks`}>
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 font-sans text-sm text-foreground/80">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                          fill="none"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="https://www.patreon.com/kafuidey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      'mt-8 block rounded-sm py-2.5 text-center font-sans text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-85',
                      isCurrent || isRecommended
                        ? 'bg-gold text-navy'
                        : 'border border-border text-foreground/70 hover:border-gold hover:text-gold',
                    ].join(' ')}
                  >
                    {isCurrent ? 'Manage on Patreon' : 'Join on Patreon'}
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── Members-only interviews ──────────────────────────── */}
        {memberInterviews.length > 0 && (
          <section>
            <div className="mb-10 flex items-center gap-4">
              <p className="shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Member Interviews
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {memberInterviews.map((interview) => {
                const hasAccess =
                  session?.isActive &&
                  session.tier &&
                  interview.patreonTier
                    ? (['supporter', 'insider', 'inner_circle'] as PatreonTier[]).indexOf(session.tier) >=
                      (['supporter', 'insider', 'inner_circle'] as PatreonTier[]).indexOf(
                        interview.patreonTier as PatreonTier,
                      )
                    : false

                return (
                  <div key={interview._id} className={!hasAccess ? 'relative' : ''}>
                    <InterviewCardComponent interview={interview} />
                    {/* Lock overlay for non-members */}
                    {!hasAccess && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-sm bg-background/80 backdrop-blur-[2px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-foreground/60">
                          {interview.patreonTier?.replace('_', ' ')} tier
                        </p>
                        <a
                          href="https://www.patreon.com/kafuidey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 rounded-sm bg-gold px-4 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-navy"
                        >
                          Unlock
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
