import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const interviewSchema = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  icon: PlayIcon,
  groups: [
    { name: 'content',    title: 'Content',    default: true },
    { name: 'media',      title: 'Media' },
    { name: 'transcript', title: 'Story / Transcript' },
    { name: 'meta',       title: 'SEO & Settings' },
  ],
  fields: [
    // ─── Core identity ────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Interview Title',
      type: 'string',
      group: 'content',
      description: 'The full headline, e.g. "In Conversation with Yvonne Nelson"',
      validation: (r) => r.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guest',
      title: 'Guest Name',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guestTitle',
      title: 'Guest Title / Bio Line',
      type: 'string',
      group: 'content',
      description: 'E.g. "Award-winning Ghanaian actress and activist"',
    }),
    defineField({
      name: 'guestPhoto',
      title: 'Guest Photo',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: '2–3 sentences shown on the listing card',
      validation: (r) => r.required().max(280),
    }),

    // ─── Media ────────────────────────────────────────────────────────
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'media',
      description: 'Full YouTube URL, e.g. https://www.youtube.com/watch?v=XXXXXXX',
    }),
    defineField({
      name: 'spotifyEpisodeId',
      title: 'Spotify Episode ID',
      type: 'string',
      group: 'media',
      description: 'The Spotify episode ID (last segment of the episode URL). Shown as a link on the interview card.',
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      group: 'media',
      description: 'Just the ID part (e.g. dQw4w9WgXcQ). Used for thumbnail and embed.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover / Hero Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'Used as the large hero on the story page. Can be a still from the interview.',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Video Duration',
      type: 'string',
      group: 'media',
      description: 'E.g. "1h 12m" or "45 mins" — shown on the card',
    }),

    // ─── Transcript / Story ───────────────────────────────────────────
    defineField({
      name: 'openingQuote',
      title: 'Opening Pull Quote',
      type: 'text',
      group: 'transcript',
      rows: 2,
      description: 'A single powerful line displayed large at the top of the story, before the body.',
    }),
    defineField({
      name: 'openingQuoteAttrib',
      title: 'Pull Quote Attribution',
      type: 'string',
      group: 'transcript',
      description: 'E.g. "— Yvonne Nelson, on her childhood"',
    }),
    defineField({
      name: 'storyBody',
      title: 'Story Body (Transcript)',
      type: 'array',
      group: 'transcript',
      description: 'The full interview formatted as a longform story. Use pullquote, chapterHeading, and image blocks for editorial richness.',
      of: [
        // Normal rich text
        {
          type: 'block',
          styles: [
            { title: 'Normal',          value: 'normal' },
            { title: 'Chapter Heading', value: 'h2' },
            { title: 'Section Heading', value: 'h3' },
            { title: 'Caption',         value: 'caption' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',          value: 'strong' },
              { title: 'Italic',        value: 'em' },
              { title: 'Underline',     value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
        // Pull quote block
        {
          name: 'pullQuote',
          title: 'Pull Quote',
          type: 'object',
          fields: [
            defineField({ name: 'quote',       type: 'text',   title: 'Quote Text', validation: (r) => r.required() }),
            defineField({ name: 'attribution', type: 'string', title: 'Attribution (optional)' }),
          ],
          preview: {
            select: { title: 'quote' },
            prepare: ({ title }: { title: string }) => ({ title: `" ${title?.substring(0, 60)}…"` }),
          },
        },
        // Inline image with caption
        {
          name: 'storyImage',
          title: 'Story Image',
          type: 'object',
          fields: [
            defineField({ name: 'image',   type: 'image', title: 'Image', options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: 'alt',     type: 'string', title: 'Alt Text',  validation: (r) => r.required() }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
            defineField({
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: { list: ['full', 'inset-left', 'inset-right'], layout: 'radio' },
              initialValue: 'full',
            }),
          ],
          preview: {
            select: { media: 'image', subtitle: 'caption' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: ({ media, subtitle }: Record<string, any>) => ({ title: 'Story Image', subtitle, media }),
          },
        },
        // Chapter divider
        {
          name: 'divider',
          title: 'Chapter Divider',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label (optional)', description: 'E.g. "Part II" or leave blank for a plain ornament' }),
          ],
          preview: {
            select: { title: 'label' },
            prepare: ({ title }: { title?: string }) => ({ title: title ? `✦ ${title}` : '✦ Divider' }),
          },
        },
        // Fact box / callout
        {
          name: 'factBox',
          title: 'Fact Box / Callout',
          type: 'object',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Heading' }),
            defineField({ name: 'body',    type: 'text',   title: 'Content', rows: 3 }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'body' },
            prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({ title, subtitle }),
          },
        },
      ],
    }),

    // ─── Classification & Settings ────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      description: 'Primary category — used for filtering on the interviews listing page.',
      options: {
        list: [
          { title: 'Politics',      value: 'Politics' },
          { title: 'Entertainment', value: 'Entertainment' },
          { title: 'Business',      value: 'Business' },
          { title: 'Culture',       value: 'Culture' },
          { title: 'Sports',        value: 'Sports' },
          { title: 'Media',         value: 'Media' },
          { title: 'Music',         value: 'Music' },
          { title: 'Film',          value: 'Film' },
          { title: 'Philanthropy',  value: 'Philanthropy' },
          { title: 'Health',         value: 'Health' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      description: 'Optional free-form keywords (e.g. "Accra", "elections", "music industry").',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isPatreonOnly',
      title: 'Patreon Members Only?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'If true, full transcript and video require Patreon membership.',
    }),
    defineField({
      name: 'patreonTier',
      title: 'Minimum Patreon Tier',
      type: 'string',
      group: 'meta',
      hidden: ({ document }) => !document?.isPatreonOnly,
      options: {
        list: [
          { title: 'Supporter',        value: 'supporter' },
          { title: 'Insider',          value: 'insider' },
          { title: 'Inner Circle',     value: 'inner_circle' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Interview',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Pin to the homepage hero / featured slot.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'meta',
      rows: 2,
    }),
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'guest',
      media:    'coverImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle, media }: Record<string, any>) {
      return {
        title,
        subtitle: subtitle ? `Guest: ${subtitle}` : '',
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})
