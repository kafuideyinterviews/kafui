'use client'

import { useState } from 'react'

interface ShowMoreGridProps {
  initialCount?: number
  children: React.ReactNode[]
  viewAllHref?: string
  label?: string
}

/**
 * Renders the first `initialCount` children and hides the rest behind a
 * "View More" arrow button. Optionally shows a "View All →" link.
 */
export default function ShowMoreGrid({
  initialCount = 9,
  children,
  viewAllHref,
  label = 'View More',
}: ShowMoreGridProps) {
  const [expanded, setExpanded] = useState(false)
  const items = Array.isArray(children) ? children : [children]
  const visible = expanded ? items : items.slice(0, initialCount)
  const hasMore = items.length > initialCount

  return (
    <>
      {visible}

      {hasMore && !expanded && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setExpanded(true)}
            className="group inline-flex items-center gap-2 rounded-sm border border-gold/50 px-6 py-2.5 font-sans text-sm font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            {label}
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {viewAllHref && (
            <a
              href={viewAllHref}
              className="font-sans text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:text-gold"
            >
              View All →
            </a>
          )}
        </div>
      )}
    </>
  )
}
