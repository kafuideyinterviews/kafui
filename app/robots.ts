import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/preview/'],
      },
    ],
    sitemap: 'https://kafuideyinterviews.com/sitemap.xml',
    host:    'https://kafuideyinterviews.com',
  }
}
