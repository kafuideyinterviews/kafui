import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const milestoneSchema = defineType({
  name: 'milestone',
  title: 'Career Milestone',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'E.g. "2005" or "2010–2015"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'E.g. "Host, Newsfile — Joy FM"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation / Network',
      type: 'string',
      description: 'E.g. "Joy FM", "TV3", "GTV"',
    }),
    defineField({
      name: 'logo',
      title: 'Organisation Logo',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A brief note about this milestone — what was significant about it',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear higher on the timeline (use chronological order)',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: 'Chronological', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'year', media: 'logo' },
  },
})
