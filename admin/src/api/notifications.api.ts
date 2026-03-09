import { apiRequest } from '@/lib/api-client'
import type { Notification } from '@/types/notification.types'
import type { PaginatedResponse } from '@/types/user.types'

type SortOrder = 'ASC' | 'DESC' | 'asc' | 'desc'

export type GetNotificationsParams = {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: SortOrder
  isRead?: boolean
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

export function getNotifications(params: GetNotificationsParams): Promise<PaginatedResponse<Notification>> {
  return apiRequest<PaginatedResponse<Notification>>(`/notifications${toQueryString(params)}`)
}

export function getUnreadCount(): Promise<{ count: number }> {
  return apiRequest<{ count: number }>('/notifications/unread-count')
}

export function markRead(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/notifications/${id}/read`, {
    method: 'PATCH',
  })
}
