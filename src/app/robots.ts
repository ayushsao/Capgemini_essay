import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://essaytude.com' 
    : 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
          '/resources',
          '/api/essay-analysis',
          '/api/grammar-check'
        ],
        disallow: [
          '/private/',
          '/admin/',
          '/api/auth/',
          '/api/firebase/',
          '/api/internal/',
          '/_next/',
          '/node_modules/',
          '/.env*',
          '/src/',
          '/*.json$',
          '/dashboard/*',
          '/user/*'
        ],
        crawlDelay: 1
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/auth/',
          '/dashboard/',
          '/private/',
          '/admin/'
        ]
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/private/',
          '/admin/'
        ],
        crawlDelay: 2
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
