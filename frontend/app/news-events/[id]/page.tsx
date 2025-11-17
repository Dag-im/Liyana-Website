'use client';

import { EventDetail } from '@/components/client/news-events/EventDetail';
import { NewsDetail } from '@/components/client/news-events/NewsDetail';
import { notFound, useParams } from 'next/navigation';
import { newsEventsData } from '../data';

export default function NewsEventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const item = newsEventsData.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  if (item.type === 'news') {
    return (
      <NewsDetail
        title={item.title}
        date={item.date}
        content={item.content}
        mainImage={item.mainImage}
        keyHighlights={item.keyHighlights || []}
        image1={item.image1}
        image2={item.image2}
      />
    );
  }

  if (item.type === 'event') {
    return (
      <EventDetail
        title={item.title}
        date={item.date}
        location={item.location || ''}
        content={item.content}
        mainImage={item.mainImage}
        image1={item.image1}
        image2={item.image2}
      />
    );
  }

  return null;
}
