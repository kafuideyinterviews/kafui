import Link from 'next/link'

export interface PopularItem {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  views?: number
  category?: string
  guest?: string
  coverImage: {
    asset: { url: string; metadata: { dimensions: { width: number; height: number }; lqip: string } }
    alt: string
  }
}

interface PopularSidebarProps {
  items: PopularItem[]
  basePath: 'blog' | 'interviews'
  heading?: string
}

function formatViews(n?: number): string {
  if (!n) return 'New'
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k views`
  return `${n} views`
}

export default function PopularSidebar({
  items,
  basePath,
  heading = 'Most Popular',
}: PopularSidebarProps) {
  return (
    <aside className="w-full">
      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3 border-b-2 border-gold pb-2">
        <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground">
          {heading}
        </h2>
      </div>

      <ol className="space-y-0 divide-y divide-border">
        {items.map((item, i) => {
          const href = `/${basePath}/${item.slug.current}`

          return (
            <li key={item._id} className="flex gap-3 py-3">
              {/* Rank number */}
              <span className="mt-0.5 shrink-0 font-serif text-2xl font-bold leading-none text-gold/60 w-6">
                {i + 1}
              </span>

              {/* Text */}
              <div className="flex min-w-0 flex-col gap-1">
                <Link href={href}>
                  <p className="font-sans text-xs font-semibold leading-snug text-foreground transition-colors hover:text-gold">
                    {item.title}
                  </p>
                </Link>
                <span className="font-sans text-[10px] text-muted">
                  {item.category && <span className="text-gold">{item.category} · </span>}
                  {formatViews(item.views)}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
