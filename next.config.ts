import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // @react-pdf/renderer and its sub-packages use Node.js-only APIs; prevent bundling
  serverExternalPackages: [
    '@react-pdf/renderer',
    '@react-pdf/fns',
    '@react-pdf/font',
    '@react-pdf/layout',
    '@react-pdf/pdfkit',
    '@react-pdf/primitives',
    '@react-pdf/reconciler',
    '@react-pdf/render',
    '@react-pdf/types',
  ],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },
  // Ensure strict TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async headers() {
    return [
      {
        // Tell the browser the SW is allowed to control the full origin scope,
        // and never serve a cached copy of the SW file itself.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control',        value: 'no-store, no-cache, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        // Manifest must not be cached aggressively
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ]
  },
}

export default nextConfig
