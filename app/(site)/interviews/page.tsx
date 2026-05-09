import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { interviewsListQuery } from '@/sanity/lib/queries'
import type { InterviewCard } from '@/sanity/lib/queries'
import InterviewCardComponent from '@/components/interview/InterviewCard'


export const metadata: Metadata = {
  title: 'All Interviews — Kafui Dey',
  description:
    "A library of in-depth conversations with Ghana's most compelling voices — in politics, entertainment, business, and culture.",
  openGraph: {
    title: 'All Interviews — Kafui Dey',
    description: "Deep conversations with Ghana's most compelling voices.",
    url: 'https://kafuideyinterviews.com/interviews',
    siteName: 'Kafui Dey Interviews',
  },
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// Canonical order for category tabs — all 9 from the schema
const CATEGORY_ORDER = ['Politics', 'Entertainment', 'Business', 'Culture', 'Sports', 'Media', 'Music', 'Film', 'Philanthropy', 'Health']

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category ?? 'All'

  const interviews: InterviewCard[] = await client.fetch(interviewsListQuery)

  const featured = interviews.find((i) => i.featured) ?? interviews[0]

  // Derive the category tabs dynamically — only show categories that have at least one interview
  const usedCategories = CATEGORY_ORDER.filter((cat) =>
    interviews.some((i) => i.category === cat)
  )
  const categories = ['All', ...usedCategories]

  const filtered =
    activeCategory === 'All'
      ? interviews
      : interviews.filter((i) => i.category === activeCategory)

  // On 'All' view: exclude the featured hero card from the grid to avoid duplication.
  // On category views: show every matching interview in the grid (including featured).
  const rest =
    activeCategory === 'All'
      ? filtered.filter((i) => i._id !== featured?._id)
      : filtered

  // "More Interviews" — 2 cards from outside the current category for category pages
  const moreInterviews: InterviewCard[] =
    activeCategory !== 'All'
      ? interviews
          .filter((i) => i.category !== activeCategory)
          .slice(0, 2)
      : []

  return (
    <main className="min-h-screen bg-background">
      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="border-b border-border pb-16 pt-40 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          The Interview Archive
        </p>
        <h1 className="font-serif text-5xl md:text-6xl italic font-normal text-navy dark:text-cream">
          Conversations
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base text-muted leading-relaxed">
          In-depth dialogues with Ghana's most compelling voices — told as stories.
        </p>
      </header>

      {/* ── Category Filter ───────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === 'All' ? '/interviews' : `/interviews?category=${cat}`}
                className={[
                  'shrink-0 rounded-sm px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors',
                  activeCategory === cat
                    ? 'bg-gold text-navy'
                    : 'text-muted hover:text-foreground',
                ].join(' ')}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Featured Interview (All view only) ───────────────── */}
        {featured && activeCategory === 'All' && (
          <section className="mb-16">
            <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Featured Interview
            </p>
            <InterviewCardComponent interview={featured} priority featured />
          </section>
        )}

        {/* ── Category heading (filtered view) ─────────────────── */}
        {activeCategory !== 'All' && (
          <div className="mb-10">
            <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Category
            </p>
            <h2 className="font-serif text-3xl italic text-navy dark:text-cream">
              {activeCategory}
            </h2>
            <p className="mt-1 font-sans text-sm text-muted">
              {filtered.length} interview{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* ── Divider ──────────────────────────────────────────── */}
        {activeCategory === 'All' && rest.length > 0 && (
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="font-serif text-gold text-lg">✦</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* ── Interview Grid ─────────────────────────────────────── */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
            {rest.map((interview, i) => (
              <InterviewCardComponent key={interview._id} interview={interview} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center font-sans text-muted">
            No interviews found in this category yet.
          </p>
        )}

        {/* ── More Interviews (category pages only) ─────────────── */}
        {moreInterviews.length > 0 && (
          <section className="mt-20 border-t border-border pt-14">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  More Interviews
                </p>
                <h2 className="font-serif text-2xl italic text-navy dark:text-cream">
                  From the Archive
                </h2>
              </div>
              <a
                href="/interviews"
                className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
              {moreInterviews.map((interview, i) => (
                <InterviewCardComponent key={interview._id} interview={interview} priority={i === 0} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
