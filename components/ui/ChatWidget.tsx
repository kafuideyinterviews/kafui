'use client'

import { useState, useEffect, useRef } from 'react'

const PHONE_RAW   = '+233530505031'          // E.164 for tel/sms
const WHATSAPP_NO = '233530505031'           // no leading +

const ACTIONS = [
  {
    id:    'call',
    label: 'Call',
    sub:   'Book via phone call',
    href:  `tel:${PHONE_RAW}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
      </svg>
    ),
  },
  {
    id:    'whatsapp',
    label: 'WhatsApp',
    sub:   'Book via WhatsApp message',
    href:  `https://wa.me/${WHATSAPP_NO}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id:    'sms',
    label: 'Text Message',
    sub:   'Book via SMS',
    href:  `sms:${PHONE_RAW}`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>
    ),
  },
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="flex flex-row items-center gap-3">

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-navy text-gold shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-gold hover:text-navy active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 10.5L8 5.5L13 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Chat FAB + panel (panel floats above the FAB) */}
      <div className="relative flex flex-col items-center">

        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Book an interview — contact options"
          aria-hidden={!open}
          className={`absolute bottom-full mb-4 w-72 overflow-hidden rounded-md border border-gold/20 bg-navy shadow-[0_-8px_40px_rgba(0,0,0,0.55)] transition-all duration-300 ${
            open
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#111827] px-4 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C" aria-hidden="true">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </span>
          <div>
            <p className="font-sans text-sm font-semibold text-white">Book an Interview</p>
            <p className="font-sans text-xs text-white/40">Reach Kafui Dey directly</p>
          </div>
        </div>

        {/* Action buttons */}
        <ul className="divide-y divide-white/5 py-1">
          {ACTIONS.map(({ id, label, sub, href, icon }) => (
            <li key={id}>
              <a
                href={href}
                target={id === 'whatsapp' ? '_blank' : undefined}
                rel={id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/5"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  id === 'whatsapp'
                    ? 'bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366]/25'
                    : 'bg-gold/10 text-gold group-hover:bg-gold/20'
                }`}>
                  {icon}
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-white">{label}</p>
                  <p className="truncate font-sans text-xs text-white/40">{sub}</p>
                </div>
                <svg className="ml-auto shrink-0 text-white/20 transition-colors group-hover:text-gold" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-2.5 text-center">
          <p className="font-sans text-2xs text-white/25 tracking-wide uppercase">
            {PHONE_RAW}
          </p>
        </div>
      </div>

      {/* FAB trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close booking options' : 'Book an interview with Kafui Dey'}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gold shadow-[0_8px_30px_rgba(201,168,76,0.45)] transition-all duration-300 hover:bg-[#b8973e] hover:shadow-[0_12px_40px_rgba(201,168,76,0.6)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {/* Calendar icon */}
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="#0B0F1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${open ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
        >
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        {/* Close icon */}
        <svg
          width="22" height="22" viewBox="0 0 22 22" fill="none"
          stroke="#0B0F1A" strokeWidth="2" strokeLinecap="round"
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
        >
          <path d="M4 4l14 14M18 4L4 18"/>
        </svg>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-gold/30" aria-hidden="true" />
        )}
      </button>
      </div>{/* end relative wrapper */}
    </div>
  )
}
