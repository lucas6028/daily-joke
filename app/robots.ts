import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/private/', '/api/'],
      },
    ],
    host: 'https://daily-joke.vercel.app',
    sitemap: 'https://daily-joke.vercel.app/sitemap.xml',
  }
}
