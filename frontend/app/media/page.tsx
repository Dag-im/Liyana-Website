import MediaGalleryPageClient from '@/app/media/MediaGalleryPageClient';
import { JsonLd } from '@/components/shared/JsonLd';
import { getMediaFolders } from '@/lib/api/media.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { MediaFolder } from '@/types/media.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Media Gallery',
  description:
    "Explore Liyana Healthcare's media gallery — photo collections, video highlights, and visual documentation of our facilities, events, leadership, and community initiatives.",
  openGraph: {
    title: 'Media Gallery | Liyana Healthcare',
    description: 'Photo collections and video highlights from Liyana Healthcare.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/media`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/media`,
  },
};

export default async function MediaGalleryPage() {
  let folders: MediaFolder[] = [];

  try {
    const res = await getMediaFolders({ perPage: 50 });
    folders = res.data;
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Media', url: `${process.env.NEXT_PUBLIC_SITE_URL}/media` },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <MediaGalleryPageClient folders={folders} />
    </>
  );
}
