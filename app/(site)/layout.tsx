import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://kafuideyinterviews.com'),
  title: {
    default:  'Kafui Dey — Conversations That Matter',
    template: '%s — Kafui Dey',
  },
  description:
    'In-depth interviews with Ghana\'s most compelling voices in politics, entertainment, business, and culture — told as longform stories.',
  openGraph: {
    siteName: 'Kafui Dey Interviews',
    locale:   'en_GH',
    type:     'website',
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@kafuidey',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
