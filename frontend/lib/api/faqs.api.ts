import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { Faq, FaqCategory } from '@/types/faq.types';

export type FaqListPayload = {
  data: Faq[];
  total: number;
};

export async function getFaqs(params?: {
  categoryId?: string;
  perPage?: number;
}): Promise<FaqListPayload> {
  const query = new URLSearchParams();
  query.set('perPage', String(params?.perPage ?? 100));

  if (params?.categoryId) {
    query.set('categoryId', params.categoryId);
  }

  return apiRequest<FaqListPayload>(`/faqs?${query.toString()}`, {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['faqs'] },
  });
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  return apiRequest<FaqCategory[]>('/faq-categories', {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['faq-categories'] },
  });
}
