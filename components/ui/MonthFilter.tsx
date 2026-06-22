'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface MonthFilterProps {
  /** Available months derived from data, e.g. ["2026-06", "2026-05", ...] */
  months: string[]
  /** Currently selected month value, e.g. "2026-06" or "" for all */
  activeMonth: string
}

function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function MonthFilter({ months, activeMonth }: MonthFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function navigate(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('month', value)
    } else {
      params.delete('month')
    }
    // Keep the active category if one is set
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="shrink-0 font-sans text-xs font-semibold uppercase tracking-widest text-muted">
        Date
      </label>
      <div className="relative">
        <select
          value={activeMonth}
          onChange={(e) => navigate(e.target.value)}
          className="appearance-none rounded-sm border border-border bg-background py-1.5 pl-3 pr-8 font-sans text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
        >
          <option value="">All Time</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  )
}
