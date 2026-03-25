import { apiRequest } from '@/lib/api-client'

export function deleteTempUpload(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/uploads/${id}`, {
    method: 'DELETE',
  })
}
