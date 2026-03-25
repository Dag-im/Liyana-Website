'use server';

import { apiRequest } from '@/lib/api-client';
import type { NewsEvent } from '@/types/news-events.types';

export async function filterNewsEvents(params: {
  type?: 'news' | 'event';
  search?: string;
}): Promise<NewsEvent[]> {
  try {
    const query = new URLSearchParams();
    query.set('status', 'PUBLISHED');
    query.set('page', '1');
    query.set('perPage', '200');

    if (params.type) {
      query.set('type', params.type);
    }

    if (params.search?.trim()) {
      query.set('search', params.search.trim());
    }

    const result = await apiRequest<{
      data: NewsEvent[];
      total: number;
      page: number;
      perPage: number;
    }>(`/news-events?${query.toString()}`, {
      cache: 'no-store',
    });

    return result.data;
  } catch {
    return [];
  }
}
