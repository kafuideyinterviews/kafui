'use client'

import { useEffect, useRef } from 'react'

export default function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const doc    = document.documentElement
      const scroll = doc.scrollTop  || document.body.scrollTop
      const height = doc.scrollHeight - doc.clientHeight
      const pct    = height > 0 ? (scroll / height) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[3px] w-0 bg-gold transition-none"
      ref={barRef}
      aria-hidden="true"
    />
  )
}
