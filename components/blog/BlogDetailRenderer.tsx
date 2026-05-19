import Image from 'next/image'
import type { BlogBlock } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default function BlogDetailRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (!block || typeof block !== 'object' || !('_type' in block)) return null

        const blockType = (block as Record<string, unknown>)._type

        // Handle block-level text (paragraphs, headings, etc.)
        if (blockType === 'block') {
          const b = block as Record<string, unknown>
          const style = (b.style as string) || 'normal'
          const text = (b.children as any[])?.map((c: any) => c.text).join('') || ''
          const marks = (b.children as any[])?.[0]?.marks || []

          if (style === 'h2') {
            return (
              <h2 key={i} className="mt-12 mb-4 font-serif text-2xl italic text-navy dark:text-cream">
                {text}
              </h2>
            )
          } else if (style === 'h3') {
            return (
              <h3 key={i} className="mt-10 mb-3 font-serif text-xl italic text-navy dark:text-cream">
                {text}
              </h3>
            )
          } else if (style === 'blockquote') {
            return (
              <blockquote key={i} className="my-6 border-l-4 border-gold py-2 pl-4 italic text-foreground/80">
                "{text}"
              </blockquote>
            )
          } else {
            return (
              <p key={i} className="mb-4 leading-relaxed text-foreground/90">
                {text}
              </p>
            )
          }
        }

        // Handle pull quotes
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

        // Handle images
        if (blockType === 'image' || blockType === 'storyImage') {
          const b = block as Record<string, unknown>
          const imageData = (b.image || b.asset) as Record<string, unknown>
          if (!imageData) return null

          const layout = (b.layout as string) || 'full'
          const layoutClasses = {
            full: 'w-full my-8',
            'inset-left': 'float-left w-1/2 mr-6 mb-4',
            'inset-right': 'float-right w-1/2 ml-6 mb-4',
          }

          const metadata = (imageData.asset as Record<string, unknown>)?.metadata as Record<string, unknown> || {}
          const dimensions = metadata.dimensions as Record<string, unknown> || {}

          return (
            <figure key={i} className={layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.full}>
              <div className="overflow-hidden rounded-sm bg-muted">
                <Image
                  src={urlFor(imageData).auto('format').url()}
                  alt={(imageData.alt as string) || 'Article image'}
                  width={(dimensions.width as number) || 800}
                  height={(dimensions.height as number) || 600}
                  placeholder="blur"
                  blurDataURL={(metadata.lqip as string) || undefined}
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

        // Handle dividers
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

        // Handle fact boxes
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

        // Fallback for unknown blocks
        return null
      })}
    </>
  )
}
