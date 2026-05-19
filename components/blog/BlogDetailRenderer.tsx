import Image from 'next/image'
import type { BlogBlock } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default function BlogDetailRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (!block || !block._type) return null

        // Handle block-level text (paragraphs, headings, etc.)
        if (block._type === 'block') {
          const style = (block.style as string) || 'normal'
          const text = (block.children as any[])?.map((c: any) => c.text).join('') || ''
          const marks = (block.children as any[])?.[0]?.marks || []

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
        if (block._type === 'pullQuote') {
          return (
            <blockquote
              key={i}
              className="my-8 border-l-4 border-gold bg-border/5 py-4 pl-6 font-serif text-lg italic text-navy dark:text-cream"
            >
              <p>{block.quote}</p>
              {block.attribution && (
                <footer className="mt-2 font-sans text-sm font-semibold text-muted">
                  — {block.attribution}
                </footer>
              )}
            </blockquote>
          )
        }

        // Handle images
        if (block._type === 'image' || block._type === 'storyImage') {
          const imageData = block.image || block.asset
          if (!imageData) return null

          const layout = (block.layout as string) || 'full'
          const layoutClasses = {
            full: 'w-full my-8',
            'inset-left': 'float-left w-1/2 mr-6 mb-4',
            'inset-right': 'float-right w-1/2 ml-6 mb-4',
          }

          return (
            <figure key={i} className={layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.full}>
              <div className="overflow-hidden rounded-sm bg-muted">
                <Image
                  src={urlFor(imageData).auto('format').url()}
                  alt={imageData.alt || 'Article image'}
                  width={imageData.asset.metadata?.dimensions?.width || 800}
                  height={imageData.asset.metadata?.dimensions?.height || 600}
                  placeholder="blur"
                  blurDataURL={imageData.asset.metadata?.lqip}
                  className="h-auto w-full object-cover"
                />
              </div>
              {block.caption && (
                <figcaption className="mt-2 font-sans text-sm text-muted italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          )
        }

        // Handle dividers
        if (block._type === 'divider') {
          return (
            <div key={i} className="my-8 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                {block.label && (
                  <span className="font-sans text-xs uppercase tracking-widest text-muted">
                    {block.label}
                  </span>
                )}
                <div className="h-px w-12 bg-border" />
              </div>
            </div>
          )
        }

        // Handle fact boxes
        if (block._type === 'factBox') {
          return (
            <aside key={i} className="my-8 border-l-4 border-gold bg-gold/10 p-4">
              <h4 className="mb-2 font-sans font-semibold text-gold">{block.heading}</h4>
              <p className="font-sans text-sm leading-relaxed text-foreground/80">
                {block.body}
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
