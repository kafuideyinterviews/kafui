import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Disables Next.js Draft Mode.
 * URL: /api/disable-preview
 */
export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
