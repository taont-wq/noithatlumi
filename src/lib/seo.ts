import { SITE, CONTACT } from '@/lib/constants';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://noithatlumi.vn';

export function buildMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const title = overrides?.title
    ? `${overrides.title} | ${SITE.name}`
    : `${SITE.name} - ${SITE.tagline}`;

  const description = overrides?.description ?? SITE.description;
  const url = overrides?.path ? `${BASE_URL}${overrides.path}` : BASE_URL;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: 'vi_VN',
      type: 'website',
      ...(overrides?.image && {
        images: [{ url: overrides.image, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(overrides?.image && { images: [overrides.image] }),
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
    verification: {
      // Add Google Search Console verification code here
      // google: 'your-code',
    },
  };
}

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.phoneRaw,
      contactType: 'customer service',
      availableLanguage: ['Vietnamese'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: BASE_URL,
    description: SITE.description,
  },
};
