import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/client'

// Read client (no token) to find the document _id from slug
const readClient = createClient({ projectId, dataset, apiVersion, useCdn: false })

export async function POST(req: NextRequest) {
  let body: { type?: string; slug?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { type, slug } = body

  if (
    !type || !slug ||
    !['blog', 'interview'].includes(type) ||
    typeof slug !== 'string' ||
    !/^[a-z0-9-]+$/.test(slug)
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!process.env.SANITY_API_TOKEN) {
    // Silently succeed when no write token is configured (dev / preview)
    return NextResponse.json({ ok: true })
  }

  try {
    // Look up the document _id by slug
    const doc = await readClient.fetch<{ _id: string } | null>(
      `*[_type == $type && slug.current == $slug][0]{ _id }`,
      { type, slug },
    )

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await writeClient.patch(doc._id).inc({ views: 1 }).commit()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('View increment failed:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
