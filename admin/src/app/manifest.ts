import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mood IT - Peşəkar Texniki Servis',
    short_name: 'Mood IT',
    description: 'Bakıda peşəkar smartfon, PlayStation, noutbuk, GPU təmiri və texniki servis',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4185DD',
    icons: [
      {
        src: '/images/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
