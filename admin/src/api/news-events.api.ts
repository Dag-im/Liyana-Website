import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/user.types'
import type { NewsEvent, NewsEventStatus, NewsEventType } from '@/types/news-events.types'

export type CreateNewsEventDto = {
  type: NewsEventType
  title: string
  date: string
  location?: string
  summary: string
  content: string[]
  keyHighlights?: string[]
  mainImage: string
  image1: string
  image2: string
}

export type GetNewsEventsParams = {
  page?: number
  perPage?: number
  search?: string
  type?: NewsEventType
  status?: NewsEventStatus
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  startDate?: string
  endDate?: string
}

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function uploadNewsEventFile(file: File): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<{ path: string }>('/news-events/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getNewsEvents(params: GetNewsEventsParams): Promise<PaginatedResponse<NewsEvent>> {
  return apiRequest<PaginatedResponse<NewsEvent>>(`/news-events${toQueryString(params)}`)
}

export function getNewsEvent(id: string): Promise<NewsEvent> {
  return apiRequest<NewsEvent>(`/news-events/${id}`)
}

export function createNewsEvent(dto: CreateNewsEventDto): Promise<NewsEvent> {
  return apiRequest<NewsEvent>('/news-events', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateNewsEvent(id: string, dto: Partial<CreateNewsEventDto>): Promise<NewsEvent> {
  return apiRequest<NewsEvent>(`/news-events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishNewsEvent(id: string): Promise<NewsEvent> {
  return apiRequest<NewsEvent>(`/news-events/${id}/publish`, {
    method: 'PATCH',
  })
}

export function unpublishNewsEvent(id: string): Promise<NewsEvent> {
  return apiRequest<NewsEvent>(`/news-events/${id}/unpublish`, {
    method: 'PATCH',
  })
}

export function deleteNewsEvent(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/news-events/${id}`, {
    method: 'DELETE',
  })
}
