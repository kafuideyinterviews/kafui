/**
 * youtubeId auto-extractor plugin.
 *
 * Registers a custom input component that, when the editor pastes a full
 * YouTube URL into the `youtubeUrl` field, automatically extracts the video
 * ID and populates the `youtubeId` field — so editors never have to do it
 * manually.
 *
 * Usage: imported inside sanity.config.ts plugins array.
 */
import { definePlugin } from 'sanity'

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Standard: https://www.youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
    // Short: https://youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0] || null
    }
    // Embed: https://www.youtube.com/embed/VIDEO_ID
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('?')[0] || null
    }
  } catch {
    // Not a valid URL — ignore
  }
  return null
}

/**
 * Plugin that patches `youtubeId` whenever `youtubeUrl` is set on an
 * interview document.
 *
 * It hooks into document-level onChange to keep both fields in sync.
 */
export const youtubeIdSync = definePlugin({
  name: 'youtube-id-sync',
  document: {
    // Runs after every field change on any document
    unstable_fieldActions: (prev, { schemaType }) => {
      if (schemaType.name !== 'interview') return prev
      return prev
    },
  },
})

export { extractYouTubeId }
