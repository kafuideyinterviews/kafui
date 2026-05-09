'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/types'

export default function FooterNav() {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col gap-2">
      {NAV_LINKS.map(({ label, href }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <li key={href}>
            <Link
              href={href}
              className={`font-sans text-sm transition-colors ${
                isActive ? 'font-semibold text-gold' : 'text-white/50 hover:text-white'
              }`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
