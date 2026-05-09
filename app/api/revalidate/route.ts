import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Sanity webhook → Next.js on-demand revalidation.
 *
 * Set up in Sanity manage (manage.sanity.io):
 *   URL:     https://kafuideyinterviews.com/api/revalidate
 *   Secret:  same value as SANITY_WEBHOOK_SECRET in .env
 *   Trigger: on publish / unpublish of any document type
 *
 * This means the moment Kafui's team publishes a new interview in Sanity
 * Studio, the live site updates within seconds without a full redeploy.
 */

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? ''

function verifySignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false
  const expected = createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  try {
    return timingSafeEqual(
      Buffer.from(`sha256=${expected}`),
      Buffer.from(signature),
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body      = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  let payload: { _type?: string; slug?: { current?: string } }
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const { _type, slug } = payload

  try {
    switch (_type) {
      case 'interview':
        // Revalidate the specific interview page and the listing
        if (slug?.current) {
          revalidatePath(`/interviews/${slug.current}`)
        }
        revalidatePath('/interviews')
        revalidatePath('/')         // Homepage shows latest interviews
        break

      case 'galleryImage':
        revalidatePath('/gallery')
        break

      case 'testimonial':
        revalidatePath('/testimonials')
        break

      case 'milestone':
      case 'siteSettings':
        revalidatePath('/about')
        revalidatePath('/')
        break

      default:
        // Fallback — revalidate everything
        revalidatePath('/', 'layout')
        break
    }

    return NextResponse.json({
      revalidated: true,
      type:        _type,
      slug:        slug?.current ?? null,
      now:         Date.now(),
    })
  } catch (err) {
    console.error('[Revalidation error]', err)
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(err) },
      { status: 500 },
    )
  }
}
