import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string', initialValue: 'Conversations That Matter' }),
    defineField({ name: 'heroBio', title: 'Hero Bio Line', type: 'string' }),

    // ── Hero Slides ────────────────────────────────────────────────────────
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      description: 'Add up to 6 slides — mix of videos and photos. They cycle automatically with arrow navigation. Recommended: 3 videos + 3 photos.',
      of: [
        {
          name: 'heroSlide',
          title: 'Slide',
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Video (.mp4)', value: 'video' },
                  { title: 'Photo',        value: 'image' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== 'image',
              fields: [
                defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
              ],
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video URL (.mp4)',
              type: 'url',
              description: 'Direct .mp4 link from Cloudinary, Bunny CDN, or any CDN. Keep under 8MB.',
              hidden: ({ parent }) => parent?.type !== 'video',
            }),
            defineField({
              name: 'videoPoster',
              title: 'Video Poster Image',
              type: 'image',
              description: 'Shown while video loads. Upload a still from the video.',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== 'video',
              fields: [
                defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
              ],
            }),
            defineField({
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
              description: 'Shown as a small label on the slide dot/indicator.',
            }),
          ],
          preview: {
            select: { title: 'caption', subtitle: 'type', media: 'image' },
            prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media: unknown }) {
              return {
                title:    title ?? (subtitle === 'video' ? 'Video slide' : 'Photo slide'),
                subtitle: subtitle === 'video' ? '▶ Video' : '🖼 Photo',
                media,
              }
            },
          },
        },
      ],
      validation: (r) => r.max(6),
    }),

    defineField({ name: 'aboutBio', title: 'About — Biography', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'aboutPhoto', title: 'About — Portrait Photo', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'patreonUrl',        title: 'Patreon Page URL',     type: 'url', initialValue: 'https://www.patreon.com/kafuidey' }),
    defineField({ name: 'youtubeChannelUrl', title: 'YouTube Channel URL',  type: 'url' }),
    defineField({ name: 'spotifyUrl',        title: 'Spotify Show URL',     type: 'url' }),
    defineField({ name: 'twitterHandle',     title: 'Twitter/X Handle',     type: 'string' }),
    defineField({ name: 'instagramHandle',   title: 'Instagram Handle',     type: 'string' }),
    defineField({ name: 'contactEmail',      title: 'Contact Email',        type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})