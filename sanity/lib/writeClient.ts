import 'server-only'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './client'

/**
 * Write client — only used for incrementing view counts via /api/views.
 * Requires SANITY_API_TOKEN with write permissions.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
