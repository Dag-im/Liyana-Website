import MediaFolderPageClient from '@/app/media/[id]/MediaFolderPageClient';
import { JsonLd } from '@/components/shared/JsonLd';
import { getFileUrl } from '@/lib/api-client';
import { getMediaFolder } from '@/lib/api/media.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { MediaFolder } from '@/types/media.types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const folder = await getMediaFolder(id);
    const imageUrl = getFileUrl(folder.coverImage);

    return {
      title: folder.name,
      description: folder.description,
      openGraph: {
        title: `${folder.name} | Liyana Healthcare Media`,
        description: folder.description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/media/${folder.id}`,
        images: imageUrl ? [{ url: imageUrl, alt: folder.name }] : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/media/${folder.id}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function MediaFolderPage({ params }: Props) {
  const { id } = await params;
  let folder: MediaFolder | null = null;

  try {
    folder = await getMediaFolder(id);
  } catch {}

  if (!folder) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Media', url: `${process.env.NEXT_PUBLIC_SITE_URL}/media` },
    {
      name: folder.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/media/${folder.id}`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <MediaFolderPageClient folder={folder} />
    </>
  );
}
