import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
  /**
   * Auto-extract types to a generated file when running:
   *   npx sanity@latest schema extract
   *
   * This gives you fully accurate TypeScript types from your
   * actual Sanity schema rather than hand-written ones.
   */
  autoUpdatesEnabled: true,
})
