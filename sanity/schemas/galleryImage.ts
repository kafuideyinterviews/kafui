import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const galleryImageSchema = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Brief description shown on hover or below the image',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'On Air',        value: 'on_air' },
          { title: 'Events',        value: 'events' },
          { title: 'Interviews',    value: 'interviews' },
          { title: 'Awards',        value: 'awards' },
          { title: 'Behind the Scenes', value: 'bts' },
          { title: 'Community',     value: 'community' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'dateTaken',
      title: 'Date / Year',
      type: 'string',
      description: 'E.g. "2023" or "March 2022"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Appear in the hero strip on the gallery page',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Newest', name: 'dateDesc', by: [{ field: 'dateTaken', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'category', media: 'image' },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: unknown }) {
      return {
        title:    title ?? 'Untitled image',
        subtitle: subtitle?.replace('_', ' '),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        media:    media as any,
      }
    },
  },
})
