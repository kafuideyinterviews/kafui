import type { Metadata } from 'next'
import { Suspense } from 'react'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { blogsListQuery, mostPopularBlogsQuery } from '@/sanity/lib/queries'
import type { BlogCard as BlogCardType } from '@/sanity/lib/queries'
import type { PopularItem } from '@/components/ui/PopularSidebar'
import BlogCard from '@/components/blog/BlogCard'
import PopularSidebar from '@/components/ui/PopularSidebar'
import ShowMoreGrid from '@/components/ui/ShowMoreGrid'
import MonthFilter from '@/components/ui/MonthFilter'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights and stories from our interviews. Explore deeper conversations and key moments.',
  keywords: [
    'Kafui Dey Interviews', 'Kafui Dey', 'interview blog', 'Ghana interviews',
    'longform stories', 'media analysis', 'African journalism',
  ],
  openGraph: {
    title: 'Blog',
    description: 'Insights and stories from our interviews.',
    url: 'https://kafuideyinterviews.com/blog',
    siteName: 'Kafui Dey Interviews',
  },
}

export const revalidate = 60

const CATEGORY_ORDER = ['General', 'Politics', 'Entertainment', 'Business', 'Culture', 'Sports', 'Media', 'Music', 'Film', 'Philanthropy', 'Health']

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; month?: string }>
}) {
  const { category, month } = await searchParams
  const activeCategory = category ?? 'All'
  const activeMonth = month ?? ''

  let blogs: BlogCardType[] = []
  let popular: PopularItem[] = []
  try {
    ;[blogs, popular] = await Promise.all([
      sanityFetch<BlogCardType[]>({ query: blogsListQuery, tags: ['blog'] }),
      sanityFetch<PopularItem[]>({ query: mostPopularBlogsQuery, tags: ['blog'] }),
    ])
  } catch (error) {
    console.error('Blog page: Sanity fetch failed:', error)
  }

  const usedCategories = CATEGORY_ORDER.filter((cat) =>
    blogs.some((b) => b.category === cat)
  )
  const categories = ['All', ...usedCategories]

  // Derive unique months (YYYY-MM) from all blogs, newest first
  const availableMonths = Array.from(
    new Set(blogs.map((b) => b.publishedAt.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a))

  const filtered = blogs
    .filter((b) => activeCategory === 'All' || b.category === activeCategory)
    .filter((b) => !activeMonth || b.publishedAt.startsWith(activeMonth))

  return (
    <main className="min-h-screen bg-background">

      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="border-b border-border pb-10 pt-36 text-center">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Stories & Insights
        </p>
        <h1 className="font-serif text-5xl md:text-6xl italic font-normal text-navy dark:text-cream">
          Blog
        </h1>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm text-muted leading-relaxed">
          Deep dives into the conversations and stories behind our interviews.
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
                  ? (activeMonth ? `/blog?month=${activeMonth}` : '/blog')
                  : (activeMonth ? `/blog?category=${cat}&month=${activeMonth}` : `/blog?category=${cat}`)
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
              {filtered.length} stor{filtered.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* ── Blog Grid ──────────────────────────────────────── */}
          <section className="min-w-0 flex-1">
            {filtered.length > 0 ? (
              <ShowMoreGrid initialCount={3} label="View More Stories">
                {(() => {
                  const rows: BlogCardType[][] = []
                  for (let i = 0; i < filtered.length; i += 3) rows.push(filtered.slice(i, i + 3))
                  return rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8 border-b border-border last:border-0">
                      {row.map((blog, i) => (
                        <BlogCard key={blog._id} blog={blog} priority={rowIdx === 0 && i < 3} />
                      ))}
                    </div>
                  ))
                })()}
              </ShowMoreGrid>
            ) : (
              <p className="py-24 text-center font-sans text-muted">
                No blog stories found in this category yet.
              </p>
            )}
          </section>

          {/* ── Sidebar ──────────────────────────────────────── */}
          {popular.length > 0 && (
            <aside className="w-full lg:w-72 xl:w-80 shrink-0">
              <PopularSidebar items={popular} basePath="blog" />
            </aside>
          )}

        </div>
      </div>
    </main>
  )
}
