import Image from 'next/image'
import type { BlogBlock } from '@/sanity/lib/queries'

// Helper: build a Sanity CDN URL from the resolved asset.url
function sanityImageUrl(url: string, width?: number): string {
  const params = new URLSearchParams({ auto: 'format', fit: 'max' })
  if (width) params.set('w', String(width))
  return `${url}?${params.toString()}`
}

export default function BlogDetailRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (!block || typeof block !== 'object' || !('_type' in block)) return null

        const blockType = (block as Record<string, unknown>)._type

        // ── Text blocks (paragraphs, headings, quotes) ─────────────────────
        if (blockType === 'block') {
          const b     = block as Record<string, unknown>
          const style = (b.style as string) || 'normal'
          const text  = (b.children as any[])?.map((c: any) => c.text).join('') || ''

          if (style === 'h2') {
            return (
              <h2 key={i} className="mt-12 mb-4 font-serif text-2xl italic text-navy dark:text-cream">
                {text}
              </h2>
            )
          }
          if (style === 'h3') {
            return (
              <h3 key={i} className="mt-10 mb-3 font-serif text-xl italic text-navy dark:text-cream">
                {text}
              </h3>
            )
          }
          if (style === 'blockquote') {
            return (
              <blockquote key={i} className="my-6 border-l-4 border-gold py-2 pl-4 italic text-foreground/80">
                "{text}"
              </blockquote>
            )
          }
          return (
            <p key={i} className="mb-4 leading-relaxed text-foreground/90">
              {text}
            </p>
          )
        }

        // ── Pull quotes ─────────────────────────────────────────────────────
        if (blockType === 'pullQuote') {
          const b = block as Record<string, unknown>
          return (
            <blockquote
              key={i}
              className="my-8 border-l-4 border-gold bg-border/5 py-4 pl-6 font-serif text-lg italic text-navy dark:text-cream"
            >
              <p>{b.quote as string}</p>
              {b.attribution && (
                <footer className="mt-2 font-sans text-sm font-semibold text-muted">
                  — {b.attribution as string}
                </footer>
              )}
            </blockquote>
          )
        }

        // ── Inline images (body images) ─────────────────────────────────────
        if (blockType === 'image' || blockType === 'storyImage') {
          const b = block as Record<string, unknown>

          // For _type === 'image': asset fields are directly on the block (from blogBodyFragment spread)
          // For _type === 'storyImage': image object is nested under b.image
          const imageObj = blockType === 'storyImage'
            ? (b.image as Record<string, unknown>)
            : b

          if (!imageObj) return null

          const asset      = imageObj.asset as Record<string, unknown> | undefined
          const assetUrl   = asset?.url as string | undefined
          const metadata   = asset?.metadata as Record<string, unknown> | undefined
          const dimensions = metadata?.dimensions as Record<string, unknown> | undefined
          const lqip       = metadata?.lqip as string | undefined
          const altText    = (imageObj.alt || b.alt) as string | undefined

          if (!assetUrl) return null

          const imgWidth  = (dimensions?.width  as number) || 800
          const imgHeight = (dimensions?.height as number) || 600

          const layout = (b.layout as string) || 'full'
          const layoutClasses: Record<string, string> = {
            'full':        'w-full my-8',
            'inset-left':  'float-left w-1/2 mr-6 mb-4',
            'inset-right': 'float-right w-1/2 ml-6 mb-4',
          }

          return (
            <figure key={i} className={layoutClasses[layout] || layoutClasses.full}>
              <div className="overflow-hidden rounded-sm bg-muted">
                <Image
                  src={sanityImageUrl(assetUrl, imgWidth)}
                  alt={altText || 'Article image'}
                  width={imgWidth}
                  height={imgHeight}
                  placeholder={lqip ? 'blur' : 'empty'}
                  blurDataURL={lqip}
                  className="h-auto w-full object-cover"
                />
              </div>
              {b.caption && (
                <figcaption className="mt-2 font-sans text-sm text-muted italic">
                  {b.caption as string}
                </figcaption>
              )}
            </figure>
          )
        }

        // ── Dividers ────────────────────────────────────────────────────────
        if (blockType === 'divider') {
          const b = block as Record<string, unknown>
          return (
            <div key={i} className="my-8 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                {b.label && (
                  <span className="font-sans text-xs uppercase tracking-widest text-muted">
                    {b.label as string}
                  </span>
                )}
                <div className="h-px w-12 bg-border" />
              </div>
            </div>
          )
        }

        // ── Fact boxes ──────────────────────────────────────────────────────
        if (blockType === 'factBox') {
          const b = block as Record<string, unknown>
          return (
            <aside key={i} className="my-8 border-l-4 border-gold bg-gold/10 p-4">
              <h4 className="mb-2 font-sans font-semibold text-gold">{b.heading as string}</h4>
              <p className="font-sans text-sm leading-relaxed text-foreground/80">
                {b.body as string}
              </p>
            </aside>
          )
        }

        // Fallback for unknown block types
        return null
      })}
    </>
  )
}