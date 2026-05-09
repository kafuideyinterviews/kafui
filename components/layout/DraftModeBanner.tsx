import Link from 'next/link'
import { draftMode } from 'next/headers'

/**
 * DraftModeBanner
 *
 * Renders a visible banner at the top of the page when Next.js Draft Mode
 * is active (i.e. an editor is previewing an unpublished Sanity document).
 *
 * Place this inside the root layout or (site) layout so it appears on
 * every page when preview is active.
 *
 * Usage in layout.tsx:
 *   import DraftModeBanner from '@/components/layout/DraftModeBanner'
 *   ...
 *   <DraftModeBanner />
 *   {children}
 */
export default async function DraftModeBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-between
                 bg-gold px-4 py-2 shadow-lg"
    >
      <p className="font-sans text-xs font-semibold text-navy">
        ⚠ Draft Mode active — you are viewing unpublished content.
      </p>
      <Link
        href="/api/disable-preview"
        className="ml-4 rounded-sm border border-navy/30 px-3 py-1 font-sans text-xs
                   font-semibold text-navy transition-colors hover:bg-navy hover:text-gold"
      >
        Exit Preview
      </Link>
    </div>
  )
}
