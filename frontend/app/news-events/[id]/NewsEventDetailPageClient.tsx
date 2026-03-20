'use client';

import { EventDetail } from '@/components/client/news-events/EventDetail';
import { NewsDetail } from '@/components/client/news-events/NewsDetail';
import type { NewsEvent } from '@/types/news-events.types';

interface NewsEventDetailPageClientProps {
  item: NewsEvent;
}

export default function NewsEventDetailPageClient({
  item,
}: NewsEventDetailPageClientProps) {
  if (item.type === 'news') {
    return <NewsDetail {...item} />;
  }

  if (item.type === 'event') {
    return <EventDetail {...item} />;
  }

  return null;
}
