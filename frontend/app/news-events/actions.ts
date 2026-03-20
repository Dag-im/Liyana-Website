'use server';

import { getNewsEvents } from '@/lib/api/news-events.api';
import type { NewsEvent } from '@/types/news-events.types';

export async function filterNewsEvents(params: {
  type?: 'news' | 'event';
  search?: string;
}): Promise<NewsEvent[]> {
  try {
    const result = await getNewsEvents({
      perPage: 200,
      type: params.type,
      page: 1,
    });

    const query = params.search?.trim().toLowerCase();
    if (!query) {
      return result.data;
    }

    return result.data.filter((item) => {
      const searchableText = [
        item.title,
        item.summary,
        item.location ?? '',
        item.type,
        item.date,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  } catch {
    return [];
  }
}
