import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { NewsEvent, NewsEventType } from '@/types/news-events.types';

export type NewsEventsListPayload = {
  data: NewsEvent[];
  total: number;
  page: number;
  perPage: number;
};

export async function getNewsEvents(params?: {
  page?: number;
  perPage?: number;
  type?: NewsEventType;
}): Promise<NewsEventsListPayload> {
  const query = new URLSearchParams();
  query.set('status', 'PUBLISHED');

  if (params?.page) {
    query.set('page', String(params.page));
  }

  query.set('perPage', String(params?.perPage ?? 20));

  if (params?.type) {
    query.set('type', params.type);
  }

  return apiRequest<NewsEventsListPayload>(`/news-events?${query.toString()}`, {
    next: { revalidate: REVALIDATE.CONTENT, tags: ['news-events'] },
  });
}

export async function getNewsEvent(id: string): Promise<NewsEvent> {
  return apiRequest<NewsEvent>(`/news-events/${id}`, {
    next: { revalidate: REVALIDATE.CONTENT, tags: ['news-events', `news-event-${id}`] },
  });
}
