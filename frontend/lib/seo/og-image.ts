const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Liyana Healthcare';

export const OG_IMAGE_CONFIG = {
  width: 1200,
  height: 630,
  logoUrl: `${SITE_URL}/images/logo.png`,
  siteName: SITE_NAME,
  brandColor: '#0880b9',
  backgroundColor: '#0f172a',
};
