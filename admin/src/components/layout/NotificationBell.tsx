import { useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import EmptyState from '@/components/shared/EmptyState'
import UrgencyBadge from '@/components/shared/UrgencyBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMarkRead, useNotifications, useUnreadCount } from '@/features/notifications/useNotifications'
import { formatDate } from '@/lib/utils'

export default function NotificationBell() {
  const queryClient = useQueryClient()
  const unreadCountQuery = useUnreadCount()
  const unreadNotificationsQuery = useNotifications({ isRead: false, page: 1, perPage: 5 })
  const markReadMutation = useMarkRead()

  const unreadCount = unreadCountQuery.data?.count ?? 0

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-red-600 px-1 text-[10px] text-white hover:bg-red-600">
              {unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">Unread notifications</p>
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          </div>

          {(unreadNotificationsQuery.data?.data ?? []).length === 0 ? (
            <EmptyState description="You're all caught up" title="No unread notifications" />
          ) : (
            <div className="space-y-2">
              {(unreadNotificationsQuery.data?.data ?? []).map((notification) => (
                <div className="rounded-md border p-3" key={notification.id}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-medium">{notification.title}</p>
                    <UrgencyBadge urgency={notification.urgency} />
                  </div>
                  <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                    <Button
                      onClick={() => {
                        markReadMutation.mutate(notification.id, {
                          onSuccess: () => {
                            toast.success('Marked as read')
                            queryClient.invalidateQueries({ queryKey: ['notifications'] })
                            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
                          },
                          onError: (error) => {
                            toast.error(error instanceof Error ? error.message : 'Failed to mark as read')
                          },
                        })
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Mark as read
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1 text-right">
            <Link className="text-sm text-primary underline-offset-4 hover:underline" to="/notifications">
              View all notifications
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
