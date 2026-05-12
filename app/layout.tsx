import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import ServiceWorkerRegistration from '@/components/ui/ServiceWorkerRegistration'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['400', '500', '600'],
  style:    ['normal', 'italic'],
  variable: '--font-serif',
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  style:    ['normal', 'italic'],
  variable: '--font-sans',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kafuideyinterviews.com'),
  title: {
    default:  'Kafui Dey — Conversations That Matter',
    template: '%s | Kafui Dey',
  },
  description:
    "In-depth interviews with Ghana's most compelling voices in politics, entertainment, business, and culture — told as longform stories.",
  keywords: [
    'Kafui Dey', 'Ghana journalist', 'Ghanaian broadcaster', 'interviews Ghana',
    'Joy FM', 'TV3 Ghana', 'African media', 'longform journalism',
  ],
  authors: [{ name: 'Kafui Dey', url: 'https://kafuideyinterviews.com' }],
  creator: 'Kafui Dey',
  publisher: 'Kafui Dey Interviews',
  openGraph: {
    type:        'website',
    locale:      'en_GH',
    url:         'https://kafuideyinterviews.com',
    siteName:    'Kafui Dey Interviews',
    title:       'Kafui Dey — Conversations That Matter',
    description: "In-depth interviews with Ghana's most compelling voices — told as longform stories.",
    images: [
      {
        url:    'https://kafuideyinterviews.com/og-default.jpg',
        width:  1200,
        height: 630,
        alt:    'Kafui Dey Interviews',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@kafuidey',
    creator:     '@kafuidey',
    title:       'Kafui Dey — Conversations That Matter',
    description: "In-depth interviews with Ghana's most compelling voices.",
    images:      ['https://kafuideyinterviews.com/og-default.jpg'],
  },
  robots: {
    index:         true,
    follow:        true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
      'max-snippet':     -1,
    },
  },
  alternates: {
    canonical: 'https://kafuideyinterviews.com',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kafui Dey',
  },
  icons: {
    icon: [
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d28d2d' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a1628' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
