import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnreadCount } from '@/features/notifications/useNotifications'
import { Bell } from 'lucide-react'

export function CommunicationDashboard() {
  const { data: unreadCount } = useUnreadCount()
  return <PlaceholderDashboard title="Communication Dashboard" count={unreadCount} />
}

export function HrDashboard() {
  const { data: unreadCount } = useUnreadCount()
  return <PlaceholderDashboard title="HR Dashboard" count={unreadCount} />
}

export function BloggerDashboard() {
  const { data: unreadCount } = useUnreadCount()
  return <PlaceholderDashboard title="Blogger Dashboard" count={unreadCount} />
}

function PlaceholderDashboard({ title, count }: { title: string; count?: number | { count: number } }) {
  const displayCount = typeof count === 'number' ? count : (count?.count ?? 0)
  return (
    <div className="space-y-6 p-6">
      <PageHeader heading={title} text="Specific features coming soon." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayCount}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="flex flex-col items-center justify-center py-20 bg-muted/20 border-dashed">
        <p className="text-muted-foreground text-lg">Detailed {title} content is coming soon.</p>
      </Card>
    </div>
  )
}
