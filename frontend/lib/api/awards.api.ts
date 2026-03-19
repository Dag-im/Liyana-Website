import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { Award } from '@/types/awards.types';

export type AwardListPayload = {
  data: Award[];
  total: number;
};

export async function getAwards(params?: {
  perPage?: number;
  year?: string;
  category?: string;
}): Promise<AwardListPayload> {
  const query = new URLSearchParams();
  query.set('perPage', String(params?.perPage ?? 50));

  if (params?.year) {
    query.set('year', params.year);
  }

  if (params?.category) {
    query.set('category', params.category);
  }

  return apiRequest<AwardListPayload>(`/awards?${query.toString()}`, {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['awards'] },
  });
}
