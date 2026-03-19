import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { Testimonial } from '@/types/testimonial.types';

export type TestimonialListPayload = {
  data: Testimonial[];
  total: number;
};

export async function getTestimonials(params?: {
  isFavorite?: boolean;
  perPage?: number;
}): Promise<TestimonialListPayload> {
  const query = new URLSearchParams();
  query.set('isApproved', 'true');

  if (params?.isFavorite !== undefined) {
    query.set('isFavorite', String(params.isFavorite));
  }

  query.set('perPage', String(params?.perPage ?? 50));

  return apiRequest<TestimonialListPayload>(`/testimonials?${query.toString()}`, {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['testimonials'] },
  });
}

export async function submitTestimonial(dto: {
  name: string;
  role: string;
  company: string;
  message: string;
}): Promise<{ id: string }> {
  return apiRequest<{ id: string }>('/testimonials', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
