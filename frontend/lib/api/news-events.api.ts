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
  search?: string;
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

  if (params?.search?.trim()) {
    query.set('search', params.search.trim());
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

export async function getLatestNews(count: number = 3): Promise<NewsEvent[]> {
  const res = await apiRequest<{ data: NewsEvent[]; total: number }>(
    `/news-events?status=PUBLISHED&type=news&perPage=${count}&page=1`,
    { next: { revalidate: REVALIDATE.CONTENT, tags: ['news-events', 'news'] } },
  );
  return res.data;
}

export async function getLatestEvents(count: number = 3): Promise<NewsEvent[]> {
  const res = await apiRequest<{ data: NewsEvent[]; total: number }>(
    `/news-events?status=PUBLISHED&type=event&perPage=${count}&page=1`,
    { next: { revalidate: REVALIDATE.CONTENT, tags: ['news-events', 'events'] } },
  );
  return res.data;
}
