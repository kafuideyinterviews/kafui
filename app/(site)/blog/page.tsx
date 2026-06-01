import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { blogsListQuery } from '@/sanity/lib/queries'
import type { BlogCard as BlogCardType } from '@/sanity/lib/queries'
import BlogCard from '@/components/blog/BlogCard'

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

const CATEGORY_ORDER = ['Politics', 'Entertainment', 'Business', 'Culture', 'Sports', 'Media', 'Music', 'Film', 'Philanthropy', 'Health']

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category ?? 'All'

  let blogs: BlogCardType[] = []
  try {
    blogs = await sanityFetch<BlogCardType[]>({ query: blogsListQuery, tags: ['blog'] })
  } catch (error) {
    console.error('Blog page: Sanity fetch failed:', error)
  }

  const usedCategories = CATEGORY_ORDER.filter((cat) =>
    blogs.some((b) => b.category === cat)
  )
  const categories = ['All', ...usedCategories]

  const filtered =
    activeCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === activeCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="border-b border-border pb-16 pt-40 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Stories & Insights
        </p>
        <h1 className="font-serif text-5xl md:text-6xl italic font-normal text-navy dark:text-cream">
          Blog
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base text-muted leading-relaxed">
          Deep dives into the conversations and stories behind our interviews.
        </p>
      </header>

      {/* ── Category Filter ───────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
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
              {filtered.length} stor{filtered.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        )}

        {/* ── Blog Grid ────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
            {filtered.map((blog, i) => (
              <BlogCard key={blog._id} blog={blog} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center font-sans text-muted">
            No blog stories found in this category yet.
          </p>
        )}
      </div>
    </main>
  )
}
