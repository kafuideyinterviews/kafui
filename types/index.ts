export type SanityImage = {
  asset: {
    url: string
    metadata: {
      dimensions: { width: number; height: number }
      lqip: string
    }
  }
  alt: string
}

export type PatreonTier = 'supporter' | 'insider' | 'inner_circle'

export type PatreonSession = {
  userId:   string
  name:     string
  email:    string
  tier:     PatreonTier
  isActive: boolean
  iat:      number
  exp:      number
}

export const TIER_LEVELS: Record<PatreonTier, number> = {
  supporter:    1,
  insider:      2,
  inner_circle: 3,
}

export function canAccessTier(userTier: PatreonTier, requiredTier: PatreonTier): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier]
}

export type NavLink = {
  label:    string
  href:     string
  external?: boolean
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',         href: '/' },
  { label: 'Interviews',   href: '/interviews' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'About',        href: '/about' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Members',      href: '/members' },
  { label: 'Contact',      href: '/contact' },
]