import type { Metadata } from 'next';

interface GenerateMetadataParams {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moodit.at';
const SITE_NAME = 'Mood IT';

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/images/logo.png',
  path = '',
}: GenerateMetadataParams): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME }],
    
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    
    alternates: {
      canonical: url,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
