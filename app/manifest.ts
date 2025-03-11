import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Joke',
    short_name: 'Daily-Joke',
    description: 'Joke of the Day. Start your day with a laugh!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-background.jpeg',
        sizes: '190x190',
        type: 'image/jpeg',
      },
    ],
  }
}
