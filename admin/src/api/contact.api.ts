import { apiRequest } from '@/lib/api-client'
import type { ContactSubmission, PaginatedResponse } from '@/types/contact.types'

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getContactSubmissions(params: {
  page?: number
  perPage?: number
  search?: string
  isReviewed?: boolean
}): Promise<PaginatedResponse<ContactSubmission>> {
  return apiRequest<PaginatedResponse<ContactSubmission>>(`/contact${toQueryString(params)}`)
}

export function getContactSubmission(id: string): Promise<ContactSubmission> {
  return apiRequest<ContactSubmission>(`/contact/${id}`)
}

export function reviewContactSubmission(id: string): Promise<ContactSubmission> {
  return apiRequest<ContactSubmission>(`/contact/${id}/review`, { method: 'PATCH' })
}

export function deleteContactSubmission(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/contact/${id}`, { method: 'DELETE' })
}
