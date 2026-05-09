import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes }   from './sanity/schemas'
import { structure }     from './sanity/desk'
import { StudioNavbar }  from './sanity/components/StudioNavbar'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name:     'kafuidey-studio',
  title:    'Kafui Dey — Studio',
  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2025-02-19' }),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      navbar: StudioNavbar,
    },
  },

  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((t) => t.templateId !== 'siteSettings')
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === 'siteSettings') {
        return prev.filter(
          ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
        )
      }
      return prev
    },
  },
})