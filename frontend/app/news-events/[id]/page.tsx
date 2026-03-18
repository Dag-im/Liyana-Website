'use client';

import { EventDetail } from '@/components/client/news-events/EventDetail';
import { NewsDetail } from '@/components/client/news-events/NewsDetail';
import type { NewsEvent } from '@/types/news-events.types';
import { notFound, useParams } from 'next/navigation';
import { newsEventsData } from '../data';

const items: NewsEvent[] = newsEventsData.map((item) => ({
  id: item.id,
  type: item.type,
  title: item.title,
  date: item.date,
  location: item.location ?? null,
  summary: item.summary,
  content: item.content,
  keyHighlights: item.keyHighlights ?? null,
  mainImage: item.mainImage,
  image1: item.image1 ?? '',
  image2: item.image2 ?? '',
  status: 'PUBLISHED',
  publishedAt: item.date,
  createdById: 'mock-author',
  createdByName: 'Liyana Healthcare',
  createdAt: item.date,
  updatedAt: item.date,
}));

export default function NewsEventDetailPage() {
  // Ensure strict typing on the params
  const params = useParams();
  const id = params?.id as string;

  const item = items.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  // Render logic based on type
  if (item.type === 'news') {
    return <NewsDetail {...item} />;
  }

  if (item.type === 'event') {
    return <EventDetail {...item} />;
  }

  return null;
}
