import { defineField, defineType } from 'sanity'
import { DocumentIcon, MicrophoneIcon } from '@sanity/icons'

export const blogSchema = defineType({
  name: 'blog',
  title: 'Blog / Story',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content',  title: 'Content',  default: true },
    { name: 'media',    title: 'Media' },
    { name: 'links',    title: 'Related Links' },
    { name: 'meta',     title: 'SEO & Settings' },
  ],
  fields: [
    // ─── Core identity ────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Story Title',
      type: 'string',
      group: 'content',
      description: 'The headline for this blog story or insight from the interview',
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
      name: 'excerpt',
      title: 'Short Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: '2–3 sentences introducing the story',
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'author',
      title: 'Author / Guest',
      type: 'string',
      group: 'content',
      description: 'The person this story is about or written by',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      description: 'Primary category — used for filtering blog stories.',
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
          { title: 'Health',        value: 'Health' },
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
      description: 'Optional free-form keywords (e.g. "Accra", "education", "social impact").',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ─── Media ────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover / Hero Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'Used as the large hero on the story page',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    // ─── Content body ────────────────────────────────────────────────
    defineField({
      name: 'body',
      title: 'Story Body',
      type: 'array',
      group: 'content',
      description: 'The full blog post or story content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',          value: 'normal' },
            { title: 'Heading 2',       value: 'h2' },
            { title: 'Heading 3',       value: 'h3' },
            { title: 'Quote',           value: 'blockquote' },
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
                title: 'URL',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (r) => r.required(),
                  }),
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
      ],
    }),

    // ─── Related Links ────────────────────────────────────────────────
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Link',
      type: 'url',
      group: 'links',
      description: 'Full YouTube URL or specific video link related to this story',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify Link',
      type: 'url',
      group: 'links',
      description: 'Spotify podcast/episode link related to this story',
    }),
    defineField({
      name: 'interviewPageUrl',
      title: 'Interview Page Link',
      type: 'url',
      group: 'links',
      description: 'Link to the main interview page for this story',
      icon: MicrophoneIcon,
    }),
    defineField({
      name: 'relatedBlog',
      title: 'Related Blog Story',
      type: 'reference',
      group: 'links',
      to: [{ type: 'blog' }],
      description: 'Link to another blog story related to this one',
    }),

    // ─── Social & Metadata ────────────────────────────────────────────
    defineField({
      name: 'enableSocialShare',
      title: 'Enable Social Share Buttons',
      type: 'boolean',
      group: 'meta',
      initialValue: true,
      description: 'Show social sharing buttons (Twitter, Facebook, LinkedIn, WhatsApp) on the story',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'meta',
      description: 'Override the page title for search engines (optional)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'meta',
      rows: 2,
      description: 'Meta description for search engines (aim for 150–160 characters)',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      description: 'Comma-separated keywords or tags for this story',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'coverImage',
      date: 'publishedAt',
    },
    prepare({ title, author, media, date }) {
      const dateStr = date ? new Date(date).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${author ? `by ${author}` : 'No author'} • ${dateStr}`,
        media,
      }
    },
  },
})
