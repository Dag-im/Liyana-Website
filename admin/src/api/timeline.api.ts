import { apiRequest } from '@/lib/api-client'
import type { TimelineItem } from '@/types/timeline.types'
import type { PaginatedResponse } from '@/types/user.types'

export type GetTimelineItemsParams = {
  page?: number
  perPage?: number
  search?: string
  year?: string
  category?: string
}

export type CreateTimelineItemDto = Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTimelineItemDto = Partial<CreateTimelineItemDto>

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const timelineApi = {
  async uploadTimelineImage(file: File): Promise<{ path: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const result = await apiRequest<{ path?: string; url?: string }>('/timeline/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    })

    return { path: result.path ?? result.url ?? '' }
  },

  getTimelineItems(params: GetTimelineItemsParams): Promise<PaginatedResponse<TimelineItem>> {
    return apiRequest<PaginatedResponse<TimelineItem>>(`/timeline${buildQuery(params)}`)
  },

  getTimelineItem(id: string): Promise<TimelineItem> {
    return apiRequest<TimelineItem>(`/timeline/${id}`)
  },

  createTimelineItem(dto: CreateTimelineItemDto): Promise<TimelineItem> {
    return apiRequest<TimelineItem>('/timeline', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateTimelineItem(id: string, dto: UpdateTimelineItemDto): Promise<TimelineItem> {
    return apiRequest<TimelineItem>(`/timeline/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteTimelineItem(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/timeline/${id}`, {
      method: 'DELETE',
    })
  },
}
