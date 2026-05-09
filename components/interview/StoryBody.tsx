'use client'

import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import type { StoryBodyBlock, PullQuote, StoryImage, Divider, FactBox } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

// ─── Pull Quote ──────────────────────────────────────────────────────────────
function PullQuoteBlock({ value }: { value: PullQuote }) {
  return (
    <blockquote className="my-12 mx-0 md:-mx-8 border-l-4 border-gold pl-6 md:pl-10 not-prose">
      <p className="font-serif text-2xl md:text-3xl italic leading-snug text-navy dark:text-cream">
        &ldquo;{value.quote}&rdquo;
      </p>
      {value.attribution && (
        <cite className="mt-4 block text-sm font-sans uppercase tracking-widest text-gold not-italic">
          {value.attribution}
        </cite>
      )}
    </blockquote>
  )
}

// ─── Story Image ─────────────────────────────────────────────────────────────
function StoryImageBlock({ value }: { value: StoryImage }) {
  const imgUrl = urlFor(value.image).width(1200).quality(85).url()

  const wrapClass = {
    full:         'my-12 mx-0 md:-mx-16',
    'inset-left':  'my-10 float-left mr-8 mb-4 w-full md:w-1/2',
    'inset-right': 'my-10 float-right ml-8 mb-4 w-full md:w-1/2',
  }[value.layout ?? 'full']

  return (
    <figure className={`not-prose ${wrapClass}`}>
      <div className="relative overflow-hidden rounded-sm">
        <Image
          src={imgUrl}
          alt={value.alt}
          width={1200}
          height={675}
          className="w-full object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
          placeholder="blur"
          blurDataURL={value.image?.asset?.metadata?.lqip ?? ''}
        />
      </div>
      {value.caption && (
        <figcaption className="mt-3 text-sm text-muted italic font-sans text-center">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Chapter Divider ─────────────────────────────────────────────────────────
function DividerBlock({ value }: { value: Divider }) {
  return (
    <div className="not-prose my-14 flex items-center gap-5">
      <div className="h-px flex-1 bg-border" />
      <span className="font-serif text-gold text-xl tracking-widest">
        {value.label ?? '✦'}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ─── Fact Box ────────────────────────────────────────────────────────────────
function FactBoxBlock({ value }: { value: FactBox }) {
  return (
    <aside className="not-prose my-10 rounded-sm border border-gold/30 bg-gold/5 px-6 py-5">
      {value.heading && (
        <p className="mb-2 text-xs font-sans uppercase tracking-widest text-gold font-semibold">
          {value.heading}
        </p>
      )}
      <p className="font-sans text-base leading-relaxed text-foreground/80">{value.body}</p>
    </aside>
  )
}

// ─── Portable Text component overrides ───────────────────────────────────────
const components = {
  types: {
    pullQuote:  ({ value }: { value: PullQuote })  => <PullQuoteBlock value={value} />,
    storyImage: ({ value }: { value: StoryImage }) => <StoryImageBlock value={value} />,
    divider:    ({ value }: { value: Divider })    => <DividerBlock value={value} />,
    factBox:    ({ value }: { value: FactBox })    => <FactBoxBlock value={value} />,
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-6 font-sans text-[1.125rem] leading-[1.85] text-foreground/90 first-of-type:[&>*]:first-letter:float-left first-of-type:[&>*]:first-letter:font-serif first-of-type:[&>*]:first-letter:text-[4.5rem] first-of-type:[&>*]:first-letter:leading-[0.8] first-of-type:[&>*]:first-letter:mr-3 first-of-type:[&>*]:first-letter:mt-1 first-of-type:[&>*]:first-letter:text-gold">
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-14 font-serif text-3xl font-normal italic text-navy dark:text-cream leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-10 font-sans text-lg font-semibold uppercase tracking-widest text-gold">
        {children}
      </h3>
    ),
    caption: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-sm italic text-muted font-sans text-center">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="font-serif italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="border-b border-gold text-gold hover:text-gold/70 transition-colors"
      >
        {children}
      </a>
    ),
  },
}

// ─── Main export ─────────────────────────────────────────────────────────────
interface StoryBodyProps {
  blocks: StoryBodyBlock[]
}

export default function StoryBody({ blocks }: StoryBodyProps) {
  if (!blocks?.length) return null
  return (
    <div className="story-body">
      <PortableText value={blocks as Parameters<typeof PortableText>[0]['value']} components={components} />
    </div>
  )
}
