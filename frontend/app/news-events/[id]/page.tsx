import { EventDetail } from '@/components/client/news-events/EventDetail';
import { NewsDetail } from '@/components/client/news-events/NewsDetail';
import { JsonLd } from '@/components/shared/JsonLd';
import { getFileUrl } from '@/lib/api-client';
import { getNewsEvent, getNewsEvents } from '@/lib/api/news-events.api';
import {
  articleSchema,
  breadcrumbSchema,
  eventSchema,
} from '@/lib/seo/structured-data';
import type { NewsEvent } from '@/types/news-events.types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await getNewsEvents({ perPage: 200 });
    return res.data.map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await getNewsEvent(id);
    const imageUrl = getFileUrl(item.mainImage);

    return {
      title: item.title,
      description: item.summary,
      openGraph: {
        title: `${item.title} | Liyana Healthcare`,
        description: item.summary,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events/${item.id}`,
        type: item.type === 'event' ? 'website' : 'article',
        images: imageUrl ? [{ url: imageUrl, alt: item.title }] : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events/${item.id}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function NewsEventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: NewsEvent | null = null;

  try {
    item = await getNewsEvent(id);
  } catch {}

  if (!item) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'News & Events',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events`,
    },
    {
      name: item.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events/${item.id}`,
    },
  ]);

  const structuredData =
    item.type === 'event'
      ? eventSchema({
          title: item.title,
          summary: item.summary,
          id: item.id,
          mainImage: getFileUrl(item.mainImage) ?? item.mainImage,
          date: item.date,
          location: item.location,
        })
      : articleSchema({
          title: item.title,
          summary: item.summary,
          id: item.id,
          mainImage: getFileUrl(item.mainImage) ?? item.mainImage,
          createdByName: item.createdByName,
          publishedAt: item.publishedAt,
        });

  return (
    <>
      <JsonLd data={[structuredData, breadcrumb]} />
      {item.type === 'news' ? <NewsDetail {...item} /> : <EventDetail {...item} />}
    </>
  );
}
