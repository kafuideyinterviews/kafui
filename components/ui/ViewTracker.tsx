'use client'

import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
  slug: string
  type: 'blog' | 'interview'
}

/**
 * Fires a single POST /api/views request when the page mounts.
 * Renders nothing — purely a side-effect component.
 */
export default function ViewTracker({ slug, type }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug }),
    }).catch(() => {/* silently ignore view-tracking failures */})
  }, [slug, type])

  return null
}
