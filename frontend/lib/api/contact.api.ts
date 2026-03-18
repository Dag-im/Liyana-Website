import { apiRequest } from '@/lib/api-client';
import type { ContactSubmission } from '@/types/contact.types';

export async function submitContact(
  dto: ContactSubmission,
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
