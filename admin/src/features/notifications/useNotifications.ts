import { useMutation, useQuery } from '@tanstack/react-query'

import {
  getNotifications,
  getUnreadCount,
  markRead,
  type GetNotificationsParams,
} from '@/api/notifications.api'
import { NOTIFICATION_REFETCH_INTERVAL } from '@/lib/constants'

export function useNotifications(params: GetNotificationsParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: NOTIFICATION_REFETCH_INTERVAL,
  })
}

export function useMarkRead() {
  return useMutation({
    mutationFn: (id: string) => markRead(id),
  })
}
