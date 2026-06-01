import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/serverClient'
import { blogBySlugQuery, relatedBlogsQuery } from '@/sanity/lib/queries'
import type { BlogFull } from '@/sanity/lib/queries'
import type { BlogCard as BlogCardType } from '@/sanity/lib/queries'
import BlogDetailRenderer from '@/components/blog/BlogDetailRenderer'
import BlogCard from '@/components/blog/BlogCard'
import ShareButtons from '@/components/interview/ShareButtons'
import Link from 'next/link'

export const revalidate = 60

// ── Constants ─────────────────────────────────────────────────────────────────
const SITE_URL     = 'https://kafuideyinterviews.com'
// Absolute URL to your default OG image (logo/brand image in /public)
// Used as fallback when a blog post has no coverImage
const DEFAULT_OG   = `${SITE_URL}/og-default.jpg`

type PageProps = {
  params: Promise<{ slug: string }>
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const blog = await sanityFetch<BlogFull>({
    query: blogBySlugQuery,
    params: { slug },
    tags: ['blog'],
  }).catch(() => null)

  if (!blog) return { title: 'Blog Post Not Found' }

  const title       = blog.seoTitle || blog.title
  const description = blog.seoDescription || blog.excerpt
  const pageUrl     = `${SITE_URL}/blog/${slug}`

  // Build the OG image URL from the resolved Sanity CDN url.
  // - fm=jpg        → forces JPEG output for maximum social preview compatibility
  // - w=1200&h=630 → standard OG dimensions
  // - fit=crop      → fills the frame without letterboxing
  // - q=60          → keeps thumbnail size under WhatsApp/Facebook limits
  //
  // Falls back to DEFAULT_OG if the post has no coverImage or asset.url.
  const rawCoverUrl = blog.coverImage?.asset?.url
  const ogImageUrl  = rawCoverUrl
    ? `${rawCoverUrl}?w=1200&h=630&fit=crop&fm=jpg&q=60`
    : DEFAULT_OG

  const ogImages = [
    {
      url:    ogImageUrl,
      width:  1200,
      height: 630,
      alt:    blog.coverImage?.alt || title,
    },
  ]

  return {
    title:       `${title} — Kafui Dey`,
    description,
    keywords:    blog.seoKeywords,

    // ── Open Graph (Facebook, WhatsApp, LinkedIn) ────────────────────────────
    openGraph: {
      title,
      description,
      type:          'article',
      url:           pageUrl,
      publishedTime: blog.publishedAt,
      authors:       blog.author ? [blog.author] : [],
      tags:          blog.tags,
      images:        ogImages,
    },

    // ── Twitter / X Card ─────────────────────────────────────────────────────
    // WhatsApp also reads twitter:image as a fallback on some clients.
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImageUrl],
    },

    // ── Canonical URL ─────────────────────────────────────────────────────────
    alternates: {
      canonical: pageUrl,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  const blog = await sanityFetch<BlogFull>({
    query: blogBySlugQuery,
    params: { slug },
    tags: ['blog'],
  }).catch((error) => {
    console.error('Blog detail page: Sanity fetch failed:', error)
    return null
  })

  if (!blog) notFound()

  const pubDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })

  // Fetch related blog posts in same category
  const related = blog.category
    ? await sanityFetch<BlogCardType[]>({
        query:  relatedBlogsQuery,
        params: { slug, category: blog.category },
        tags:   ['blog'],
      }).catch(() => [])
    : []

  return (
    <main className="min-h-screen bg-background">

      {/* ── Article Header ───────────────────────────────────────────────────── */}
      <article className="border-b border-border">
        <header className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-muted">
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <span>/</span>
            {blog.category && (
              <>
                <Link
                  href={`/blog?category=${blog.category}`}
                  className="transition-colors hover:text-foreground"
                >
                  {blog.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate max-w-[120px] sm:max-w-none overflow-hidden">
              {blog.title}
            </span>
          </nav>

          {/* Category Label */}
          {blog.category && (
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {blog.category}
            </p>
          )}

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl italic leading-tight text-navy dark:text-cream mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="mb-6 font-sans text-lg leading-relaxed text-foreground/80">
              {blog.excerpt}
            </p>
          )}

          {/* Meta — Author · Date */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-t border-border pt-6 font-sans text-sm text-muted">
            {blog.author && <span>By {blog.author}</span>}
            {blog.author && <span className="text-border">·</span>}
            <time dateTime={blog.publishedAt}>{pubDate}</time>
          </div>

          {/* Related Links */}
          {(blog.youtubeUrl || blog.spotifyUrl || blog.interviewPageUrl || blog.relatedBlog) && (
            <div className="space-y-3 bg-border/10 p-4 rounded-sm mb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                Related Content
              </p>
              <div className="flex flex-wrap gap-3">
                {blog.youtubeUrl && (
                  <a
                    href={blog.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Watch on YouTube
                  </a>
                )}
                {blog.spotifyUrl && (
                  <a
                    href={blog.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-green-600 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.491 17.412c-.237.386-.738.508-1.124.271-3.077-1.884-6.925-2.305-11.44-1.26-.424.089-.848-.133-.942-.561-.089-.424.133-.848.561-.942 4.882-1.133 8.941.722 12.184 2.577.386.236.507.737.27 1.123l-.509.792zm1.468-3.267c-.301.49-.937.644-1.428.341-3.519-2.165-8.875-2.789-13.031-1.529-.547.164-1.125-.129-1.293-.676-.163-.547.129-1.125.676-1.293 4.789-1.44 10.584.752 14.514 2.847.491.303.644.937.341 1.428l-.779 1.282zm.126-3.403c-4.221-2.508-11.195-2.738-15.226-1.514-.655.198-1.345-.156-1.542-.81-.196-.655.156-1.345.81-1.542 4.632-1.398 12.075-1.133 16.818 1.75.59.35.777 1.126.426 1.716l-.486.8c-.35.59-1.126.777-1.716.426l.486-.8-.284-.426z" />
                    </svg>
                    Listen on Spotify
                  </a>
                )}
                {blog.interviewPageUrl && (
                  <a
                    href={blog.interviewPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-purple-600 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-5 7a5 5 0 0 1-5-5H5a7 7 0 0 0 7 7v3h2v-3a7 7 0 0 0 7-7h-2a5 5 0 0 1-5 5Z" />
                    </svg>
                    Main Interview Page
                  </a>
                )}
                {blog.relatedBlog && (
                  <Link
                    href={`/blog/${blog.relatedBlog.slug.current}`}
                    className="inline-flex items-center gap-2 rounded-sm bg-blue-600 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Read {blog.relatedBlog.title}
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ── Featured / Hero Image ──────────────────────────────────────────── */}
        {blog.coverImage?.asset?.url && (
          <div className="border-t border-border overflow-hidden">
            <img
              src={`${blog.coverImage.asset.url}?auto=format&w=1200&q=80&fit=max`}
              alt={blog.coverImage.alt || blog.title}
              className="w-full h-auto max-h-80 object-contain"
            />
          </div>
        )}
      </article>

      {/* ── Article Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <BlogDetailRenderer blocks={blog.body} />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-block rounded-sm bg-border/20 px-3 py-1.5 font-sans text-sm text-muted transition-colors hover:bg-gold hover:text-navy"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Social Share */}
        {blog.enableSocialShare && (
          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">
              Share This Story
            </p>
            <ShareButtons
              url={`${SITE_URL}/blog/${slug}`}
              title={blog.title}
            />
          </div>
        )}
      </div>

      {/* ── Related Posts ─────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border bg-border/5 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                More Stories
              </p>
              <h2 className="font-serif text-3xl italic text-navy dark:text-cream">
                Related in {blog.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <BlogCard key={post._id} blog={post} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}