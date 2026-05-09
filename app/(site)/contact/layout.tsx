import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Kafui Dey — for media enquiries, interview requests, collaborations, or general correspondence.',
  alternates: { canonical: 'https://kafuideyinterviews.com/contact' },
  openGraph: {
    title:       'Contact — Kafui Dey',
    description: 'Media enquiries, interview requests, and collaborations.',
    url:         'https://kafuideyinterviews.com/contact',
    siteName:    'Kafui Dey Interviews',
    images:      [{ url: 'https://kafuideyinterviews.com/og-default.jpg', width: 1200, height: 630 }],
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Contact — Kafui Dey',
    description: 'Media enquiries, interview requests, and collaborations.',
    images:      ['https://kafuideyinterviews.com/og-default.jpg'],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
