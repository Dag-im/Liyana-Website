import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse, Testimonial } from '@/types/testimonial.types'

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getTestimonials(params: {
  page?: number
  perPage?: number
  search?: string
  isApproved?: boolean
  isFavorite?: boolean
}): Promise<PaginatedResponse<Testimonial>> {
  return apiRequest<PaginatedResponse<Testimonial>>(`/testimonials${toQueryString(params)}`)
}

export function approveTestimonial(id: string): Promise<Testimonial> {
  return apiRequest<Testimonial>(`/testimonials/${id}/approve`, { method: 'PATCH' })
}

export function unapproveTestimonial(id: string): Promise<Testimonial> {
  return apiRequest<Testimonial>(`/testimonials/${id}/unapprove`, { method: 'PATCH' })
}

export function favoriteTestimonial(id: string): Promise<Testimonial> {
  return apiRequest<Testimonial>(`/testimonials/${id}/favorite`, { method: 'PATCH' })
}

export function unfavoriteTestimonial(id: string): Promise<Testimonial> {
  return apiRequest<Testimonial>(`/testimonials/${id}/unfavorite`, { method: 'PATCH' })
}

export function deleteTestimonial(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/testimonials/${id}`, { method: 'DELETE' })
}
