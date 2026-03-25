import { useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import EmptyState from '@/components/shared/EmptyState';
import UrgencyBadge from '@/components/shared/UrgencyBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '@/features/notifications/useNotifications';
import { showErrorToast } from '@/lib/error-utils';
import { formatDate } from '@/lib/utils';

export default function NotificationBell() {
  const queryClient = useQueryClient();
  const unreadCountQuery = useUnreadCount();
  const unreadNotificationsQuery = useNotifications({
    isRead: false,
    page: 1,
    perPage: 5,
  });
  const markReadMutation = useMarkRead();

  const unreadCount = unreadCountQuery.data?.count ?? 0;

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-destructive px-1 text-[10px] text-white hover:bg-destructive">
              {unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-88 rounded-xl border border-border/80 p-0 shadow-lg"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <p className="font-medium">Unread notifications</p>
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          </div>

          {(unreadNotificationsQuery.data?.data ?? []).length === 0 ? (
            <div className="px-4 pb-4">
              <EmptyState
                description="You're all caught up"
                title="No unread notifications"
              />
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto px-3 pb-1">
              {(unreadNotificationsQuery.data?.data ?? []).map(
                (notification) => (
                  <div
                    className="rounded-lg border border-border/80 bg-card p-3"
                    key={notification.id}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-medium">
                        {notification.title}
                      </p>
                      <UrgencyBadge urgency={notification.urgency} />
                    </div>
                    <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </span>
                      <Button
                        onClick={() => {
                          markReadMutation.mutate(notification.id, {
                            onSuccess: () => {
                              toast.success('Marked as read');
                              queryClient.invalidateQueries({
                                queryKey: ['notifications'],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['notifications', 'unread-count'],
                              });
                            },
                            onError: (error) =>
                              showErrorToast(error, 'Failed to mark as read'),
                          });
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Mark as read
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="border-t border-border/70 px-4 py-3 text-right">
            <Link
              className="text-sm text-primary underline-offset-4 hover:underline"
              to="/notifications"
            >
              View all notifications
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
