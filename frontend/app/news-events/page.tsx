import { EventNewsPageGrid } from '@/components/client/news-events/EventNewsGrid';
import { JsonLd } from '@/components/shared/JsonLd';
import { getNewsEvents } from '@/lib/api/news-events.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { NewsEvent } from '@/types/news-events.types';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'News & Events',
  description:
    'Stay up to date with the latest news, announcements, and upcoming events from Liyana Healthcare — innovations in patient care, facility expansions, and community health initiatives.',
  openGraph: {
    title: 'News & Events | Liyana Healthcare',
    description:
      'Latest news, announcements, and upcoming events from Liyana Healthcare.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events`,
  },
};

export default async function NewsEventsPage() {
  let items: NewsEvent[] = [];

  try {
    const res = await getNewsEvents({ perPage: 50 });
    items = res.data;
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'News & Events',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/news-events`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <EventNewsPageGrid items={items} />
    </>
  );
}
