import type { Metadata } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Liyana Healthcare';

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  title: {
    default: `${SITE_NAME} | Excellence in Patient-Centered Care`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Liyana Healthcare delivers subspecialized medical care, advanced diagnostics, and integrated healthcare solutions across Ethiopia and East Africa. Committed to clinical excellence, innovation, and compassionate patient care.',
  keywords: [
    'Liyana Healthcare',
    'healthcare Ethiopia',
    'hospital Addis Ababa',
    'medical services Ethiopia',
    'Yanet Hospital',
    'specialist care Ethiopia',
    'East Africa healthcare',
    'patient care Ethiopia',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Excellence in Patient-Centered Care`,
    description:
      'Subspecialized medical care, advanced diagnostics, and integrated healthcare solutions across Ethiopia and East Africa.',
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Excellence in Patient-Centered Care`,
    description:
      'Subspecialized medical care, advanced diagnostics, and integrated healthcare solutions across Ethiopia and East Africa.',
    images: [`${SITE_URL}/images/logo.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};
