import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { interviewsListQuery, mostPopularInterviewsQuery } from '@/sanity/lib/queries'
import type { InterviewCard } from '@/sanity/lib/queries'
import type { PopularItem } from '@/components/ui/PopularSidebar'
import InterviewCardComponent from '@/components/interview/InterviewCard'
import PopularSidebar from '@/components/ui/PopularSidebar'
import ShowMoreGrid from '@/components/ui/ShowMoreGrid'
import MonthFilter from '@/components/ui/MonthFilter'

export const metadata: Metadata = {
  title: 'All Interviews',
  description:
    "A library of in-depth conversations with Ghana's most compelling voices — in politics, entertainment, business, and culture.",
  keywords: [
    'Kafui Dey Interviews', 'Kafui Dey', 'Ghana interviews', 'conversation archive',
    'African media', 'broadcast journalism', 'longform interview',
  ],
  openGraph: {
    title: 'All Interviews',
    description: "Deep conversations with Ghana's most compelling voices.",
    url: 'https://kafuideyinterviews.com/interviews',
    siteName: 'Kafui Dey Interviews',
  },
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// Canonical order for category tabs — all 9 from the schema
const CATEGORY_ORDER = ['General', 'Politics', 'Entertainment', 'Business', 'Culture', 'Sports', 'Media', 'Music', 'Film', 'Philanthropy', 'Health']

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; month?: string }>
}) {
  const { category, month } = await searchParams
  const activeCategory = category ?? 'All'
  const activeMonth = month ?? ''

  let interviews: InterviewCard[] = []
  let popular: PopularItem[] = []
  try {
    ;[interviews, popular] = await Promise.all([
      sanityFetch<InterviewCard[]>({ query: interviewsListQuery, tags: ['interviews'] }),
      sanityFetch<PopularItem[]>({ query: mostPopularInterviewsQuery, tags: ['interviews'] }),
    ])
  } catch (error) {
    console.error('Interviews page: Sanity fetch failed:', error)
  }

  const featured = interviews.find((i) => i.featured) ?? interviews[0]

  // Derive the category tabs dynamically — only show categories that have at least one interview
  const usedCategories = CATEGORY_ORDER.filter((cat) =>
    interviews.some((i) => i.category === cat)
  )
  const categories = ['All', ...usedCategories]

  // Derive unique months (YYYY-MM) from all interviews, newest first
  const availableMonths = Array.from(
    new Set(interviews.map((i) => i.publishedAt.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a))

  const filtered = interviews
    .filter((i) => activeCategory === 'All' || i.category === activeCategory)
    .filter((i) => !activeMonth || i.publishedAt.startsWith(activeMonth))

  // On 'All' view: exclude the featured hero card from the grid to avoid duplication.
  const rest =
    activeCategory === 'All' && !activeMonth
      ? filtered.filter((i) => i._id !== featured?._id)
      : filtered

  return (
    <main className="min-h-screen bg-background">

      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="border-b border-border pb-10 pt-36 text-center">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          The Interview Archive
        </p>
        <h1 className="font-serif text-5xl md:text-6xl italic font-normal text-navy dark:text-cream">
          Conversations
        </h1>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm text-muted leading-relaxed">
          In-depth dialogues with Ghana&apos;s most compelling voices — told as stories.
        </p>
      </header>

      {/* ── Category + Month Filter bar ───────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const href = cat === 'All'
                  ? (activeMonth ? `/interviews?month=${activeMonth}` : '/interviews')
                  : (activeMonth ? `/interviews?category=${cat}&month=${activeMonth}` : `/interviews?category=${cat}`)
                return (
                  <a
                    key={cat}
                    href={href}
                    className={[
                      'shrink-0 rounded-sm px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors',
                      activeCategory === cat
                        ? 'bg-gold text-navy'
                        : 'text-muted hover:text-foreground',
                    ].join(' ')}
                  >
                    {cat}
                  </a>
                )
              })}
            </div>
            {/* Month filter */}
            <div className="ml-auto shrink-0">
              <Suspense>
                <MonthFilter months={availableMonths} activeMonth={activeMonth} />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main content + sidebar ────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Featured hero (All view, no month filter active) */}
        {featured && activeCategory === 'All' && !activeMonth && (
          <section className="mb-10">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Featured Interview
            </p>
            <InterviewCardComponent interview={featured} priority featured />
          </section>
        )}

        {/* Category / Month heading */}
        {(activeCategory !== 'All' || activeMonth) && (
          <div className="mb-8 border-l-4 border-gold pl-4">
            {activeCategory !== 'All' && (
              <>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Category</p>
                <h2 className="font-serif text-2xl italic text-navy dark:text-cream">{activeCategory}</h2>
              </>
            )}
            {activeMonth && (
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold mt-1">
                {new Date(activeMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
            <p className="mt-0.5 font-sans text-xs text-muted">
              {filtered.length} interview{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* ── Interview Grid ────────────────────────────────── */}
          <section className="min-w-0 flex-1">
            {rest.length > 0 ? (
              <ShowMoreGrid initialCount={3} label="View More Interviews">
                {(() => {
                  const rows: InterviewCard[][] = []
                  for (let i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3))
                  return rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8 border-b border-border last:border-0">
                      {row.map((interview, i) => (
                        <InterviewCardComponent key={interview._id} interview={interview} priority={rowIdx === 0 && i < 3} />
                      ))}
                    </div>
                  ))
                })()}
              </ShowMoreGrid>
            ) : (
              <p className="py-24 text-center font-sans text-muted">
                No interviews found in this category yet.
              </p>
            )}
          </section>

          {/* ── Sidebar ──────────────────────────────────────── */}
          {popular.length > 0 && (
            <aside className="w-full lg:w-72 xl:w-80 shrink-0">
              <PopularSidebar items={popular} basePath="interviews" heading="Most Popular" />
            </aside>
          )}

        </div>
      </div>
    </main>
  )
}
