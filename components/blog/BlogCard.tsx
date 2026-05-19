import Link from 'next/link'
import Image from 'next/image'
import type { BlogCard as BlogCardType } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default function BlogCard({
  blog,
  priority = false,
}: {
  blog: BlogCardType
  priority?: boolean
}) {
  const pubDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group flex flex-col h-full">
      {/* ── Featured Image ───────────────────────────────────── */}
      <Link href={`/blog/${blog.slug.current}`} className="relative mb-4 block overflow-hidden rounded-sm">
        <div className="aspect-video overflow-hidden bg-muted">
          <Image
            src={urlFor(blog.coverImage).auto('format').url()}
            alt={blog.coverImage.alt || blog.title}
            width={blog.coverImage.asset.metadata.dimensions.width}
            height={blog.coverImage.asset.metadata.dimensions.height}
            placeholder="blur"
            blurDataURL={blog.coverImage.asset.metadata.lqip}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </div>
      </Link>

      {/* ── Metadata ─────────────────────────────────────────── */}
      <div className="mb-2 flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-muted">
        {blog.category && (
          <>
            <Link
              href={`/blog?category=${blog.category}`}
              className="text-gold transition-colors hover:text-gold/80"
            >
              {blog.category}
            </Link>
            <span className="text-border">·</span>
          </>
        )}
        <time dateTime={blog.publishedAt}>{pubDate}</time>
      </div>

      {/* ── Title ────────────────────────────────────────────── */}
      <Link href={`/blog/${blog.slug.current}`}>
        <h3 className="mb-2 font-serif text-xl italic text-navy dark:text-cream line-clamp-2 transition-colors group-hover:text-gold">
          {blog.title}
        </h3>
      </Link>

      {/* ── Author ───────────────────────────────────────────── */}
      {blog.author && (
        <p className="mb-3 font-sans text-xs text-muted">By {blog.author}</p>
      )}

      {/* ── Excerpt ──────────────────────────────────────────── */}
      <p className="mb-4 flex-1 font-sans text-sm leading-relaxed text-foreground/80">
        {blog.excerpt}
      </p>

      {/* ── Tags ─────────────────────────────────────────────── */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-sm bg-border/20 px-2 py-1 font-sans text-xs text-muted"
            >
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span className="inline-block font-sans text-xs text-muted">
              +{blog.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ── Related Links (compact) ──────────────────────────── */}
      <div className="mt-auto flex flex-wrap gap-2">
        {blog.youtubeUrl && (
          <a
            href={blog.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Watch on YouTube"
            className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-border/20 text-muted hover:bg-gold hover:text-navy transition-colors"
            aria-label="Watch on YouTube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        )}
        {blog.spotifyUrl && (
          <a
            href={blog.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Listen on Spotify"
            className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-border/20 text-muted hover:bg-green-500 hover:text-white transition-colors"
            aria-label="Listen on Spotify"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.491 17.412c-.237.386-.738.508-1.124.271-3.077-1.884-6.925-2.305-11.44-1.26-.424.089-.848-.133-.942-.561-.089-.424.133-.848.561-.942 4.882-1.133 8.941.722 12.184 2.577.386.236.507.737.27 1.123l-.509.792zm1.468-3.267c-.301.49-.937.644-1.428.341-3.519-2.165-8.875-2.789-13.031-1.529-.547.164-1.125-.129-1.293-.676-.163-.547.129-1.125.676-1.293 4.789-1.44 10.584.752 14.514 2.847.491.303.644.937.341 1.428l-.779 1.282zm.126-3.403c-4.221-2.508-11.195-2.738-15.226-1.514-.655.198-1.345-.156-1.542-.81-.196-.655.156-1.345.81-1.542 4.632-1.398 12.075-1.133 16.818 1.75.59.35.777 1.126.426 1.716l-.486.8c-.35.59-1.126.777-1.716.426l.486-.8-.284-.426z" />
            </svg>
          </a>
        )}
        {/* ── Read Article link ── */}
        <Link
          href={`/blog/${blog.slug.current}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title="Read article"
          aria-label="Read article"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </Link>
      </div>
    </article>
  )
}