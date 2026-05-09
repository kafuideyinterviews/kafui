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
}

export default nextConfig
