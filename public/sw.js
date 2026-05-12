/**
 * Kafui Dey — Service Worker
 *
 * Strategy per resource type:
 *   Static Next.js chunks (JS, CSS, fonts)  → Cache-first (versioned filenames, long-lived)
 *   Images (Sanity CDN, Cloudinary, icons)  → Cache-first (CDN URLs are immutable)
 *   Navigation (HTML pages)                → Network-first (fresh SSR, offline fallback)
 *   /api/** & Sanity fetches               → Network-only (always fresh data)
 *
 * NOTE: We intentionally do NOT precache SSR pages during install.
 * Next.js App Router pages are server-rendered and may depend on Sanity being up.
 * Attempting to cache them during install causes silent install failures.
 */

const CACHE_VERSION = 'v2'
const STATIC_CACHE  = `kafuidey-static-${CACHE_VERSION}`
const IMAGE_CACHE   = `kafuidey-images-${CACHE_VERSION}`
const PAGE_CACHE    = `kafuidey-pages-${CACHE_VERSION}`

// Only precache truly static files that are guaranteed to exist
const PRECACHE_URLS = [
  '/manifest.json',
  '/offline',
]

// ── Install ────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      // addAll fails atomically — catch per-item to be non-fatal
      await Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))
      )
      // Take control immediately without waiting for old SW to die
      await self.skipWaiting()
    })()
  )
})

// ── Activate: purge stale caches ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter(
            (k) =>
              k.startsWith('kafuidey-') &&
              ![STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE].includes(k)
          )
          .map((k) => caches.delete(k))
      )
      // Claim all open clients so the new SW controls them immediately
      await self.clients.claim()
    })()
  )
})

// ── Fetch ──────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only intercept same-origin GET requests (plus known CDN hostnames for images)
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/studio')) return
  // Passthrough cross-origin requests that aren't known image CDNs
  const sameOrigin = url.origin === self.location.origin
  const isImageCDN =
    url.hostname === 'cdn.sanity.io' ||
    url.hostname === 'res.cloudinary.com'
  if (!sameOrigin && !isImageCDN) return

  // ── Images ─────────────────────────────────────────────────────────────────
  if (
    isImageCDN ||
    /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 120, 30 * 24 * 60 * 60))
    return
  }

  // ── Next.js static chunks (JS, CSS, fonts — content-hashed filenames) ──────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 300, 365 * 24 * 60 * 60))
    return
  }

  // ── Page navigations ────────────────────────────────────────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE))
    return
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName, maxEntries, maxAgeSeconds) {
  const cache  = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    const date = cached.headers.get('date')
    if (!date) return cached
    const ageSeconds = (Date.now() - new Date(date).getTime()) / 1000
    if (ageSeconds < maxAgeSeconds) return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      // Evict oldest entry if over limit
      const keys = await cache.keys()
      if (keys.length >= maxEntries) await cache.delete(keys[0])
      await cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) return cached
    const offline = await caches.match('/offline')
    return (
      offline ??
      new Response('You are offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      })
    )
  }
}

 *
 * Strategy per resource type:
 *   Static assets (fonts, icons, JS, CSS)  → Cache-first  (long-lived, versioned by filename)
 *   Images (Sanity CDN, Cloudinary)        → Cache-first  (immutable CDN URLs)
 *   Navigation (HTML pages)               → Network-first (fresh content, fall back to cache)
 *   API / Sanity fetch                    → Network-only  (always fresh data)
 */

const CACHE_VERSION = 'v1'
const STATIC_CACHE  = `kafuidey-static-${CACHE_VERSION}`
const IMAGE_CACHE   = `kafuidey-images-${CACHE_VERSION}`
const PAGE_CACHE    = `kafuidey-pages-${CACHE_VERSION}`

const STATIC_PRECACHE = [
  '/',
  '/interviews',
  '/gallery',
  '/about',
  '/offline',
  '/manifest.json',
]

// ── Install: precache shell pages ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(STATIC_PRECACHE).catch(() => {
        // Non-fatal — some pages may not exist yet
      })
    )
  )
  self.skipWaiting()
})

// ── Activate: delete stale caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (k) =>
              k.startsWith('kafuidey-') &&
              ![STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE].includes(k)
          )
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin requests that aren't CDN
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/_next/webpack-hmr')) return
  // Skip Sanity Studio
  if (url.pathname.startsWith('/studio')) return

  // ── Images (Sanity CDN + Cloudinary + local icons) ───────────────────────
  const isImage =
    url.hostname === 'cdn.sanity.io' ||
    url.hostname === 'res.cloudinary.com' ||
    /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname)

  if (isImage) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, { maxEntries: 120, maxAgeSeconds: 30 * 24 * 60 * 60 }))
    return
  }

  // ── Static Next.js chunks (JS, CSS, fonts) ───────────────────────────────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, { maxEntries: 200, maxAgeSeconds: 365 * 24 * 60 * 60 }))
    return
  }

  // ── Navigation (HTML pages) ──────────────────────────────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE))
    return
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName, { maxEntries, maxAgeSeconds }) {
  const cache    = await caches.open(cacheName)
  const cached   = await cache.match(request)
  if (cached) {
    const dateHeader = cached.headers.get('date')
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000
      if (age < maxAgeSeconds) return cached
    } else {
      return cached
    }
  }
  try {
    const response = await fetch(request)
    if (response.ok) {
      const entries = await cache.keys()
      if (entries.length >= maxEntries) {
        cache.delete(entries[0])
      }
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return cached ?? new Response('Network error', { status: 408 })
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    // Offline fallback page
    const offline = await caches.match('/offline')
    return offline ?? new Response('You are offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}
