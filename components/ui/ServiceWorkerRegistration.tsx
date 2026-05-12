'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    // Allow on localhost (for testing) and in production. Skip on other dev origins.
    const isLocalhost = window.location.hostname === 'localhost'
    if (process.env.NODE_ENV !== 'production' && !isLocalhost) return

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })

        // Check for updates on every page load
        registration.update().catch(() => {})

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new SW is waiting — tell it to take over immediately
              newWorker.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
      } catch (err) {
        console.warn('SW registration failed:', err)
      }
    }

    // Wait until the page is fully loaded to avoid competing with critical resources
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
    }
  }, [])

  return null
}
