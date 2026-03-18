import { apiRequest } from '@/lib/api-client';
import type { TimelineItem } from '@/types/timeline.types';

export type TimelineListPayload = {
  data: TimelineItem[];
  total: number;
};

export async function getTimelineItems(params?: {
  perPage?: number;
  category?: string;
}): Promise<TimelineListPayload> {
  const query = new URLSearchParams();
  query.set('perPage', String(params?.perPage ?? 100));

  if (params?.category) {
    query.set('category', params.category);
  }

  return apiRequest<TimelineListPayload>(`/timeline?${query.toString()}`, {
    next: { revalidate: 3600, tags: ['timeline'] },
  });
}
