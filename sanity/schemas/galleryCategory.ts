import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const galleryCategorySchema = defineType({
  name: 'galleryCategory',
  title: 'Gallery Category',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'E.g. "On Air", "Events", "Awards"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Auto-generated from the title. Used in the gallery filter URL.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
      description: 'Lower number appears first in the category tabs.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Upload all images for this category here.',
      of: [
        {
          name: 'galleryItem',
          title: 'Image',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Describe the image for screen readers.',
                  validation: (r) => r.required(),
                }),
              ],
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Shown on hover in the gallery grid.',
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
              description: 'Highlight this image in the gallery.',
            }),
          ],
          preview: {
            select: { title: 'caption', media: 'image' },
            prepare({ title, media }: { title?: string; media?: unknown }) {
              return {
                title: title ?? 'Untitled image',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                media: media as any,
              }
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Title A–Z',     name: 'titleAsc',  by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', images: 'images' },
    prepare({ title, images }: { title?: string; images?: unknown[] }) {
      const count = images?.length ?? 0
      return {
        title:    title ?? 'Untitled category',
        subtitle: `${count} image${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
