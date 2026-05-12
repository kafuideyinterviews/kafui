'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent
  }
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    // Already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if ((navigator as Navigator & { standalone?: boolean }).standalone) return
    // User dismissed this session
    if (sessionStorage.getItem('pwa-dismissed')) return

    const attach = (e: BeforeInstallPromptEvent) => {
      window.__pwaInstallPrompt = e
      setDeferredPrompt(e)
      setVisible(true)
    }

    // If the event was captured before React mounted (common on fast connections),
    // read it from the global the inline <head> script stored it in.
    if (window.__pwaInstallPrompt) {
      attach(window.__pwaInstallPrompt)
      return
    }

    // Otherwise listen for it normally (slower connections / re-visits)
    const handler = (e: Event) => {
      e.preventDefault()
      attach(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setInstalling(true)
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setInstalling(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setVisible(false)
    // Don't show again this session
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Install Kafui Dey app"
      className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-sm border border-white/10 bg-navy/95 px-5 py-4 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0"
    >
      <div className="flex items-start gap-4">
        {/* App icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-96x96.png"
          alt="Kafui Dey"
          width={48}
          height={48}
          className="mt-0.5 shrink-0 rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
            Install App
          </p>
          <p className="mt-0.5 font-sans text-sm font-medium text-white">
            Kafui Dey Interviews
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-white/55">
            Add to your home screen for a faster, offline-ready experience.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="rounded-sm bg-gold px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-navy transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {installing ? 'Installing…' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 font-sans text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 text-white/30 transition-colors hover:text-white/60"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
