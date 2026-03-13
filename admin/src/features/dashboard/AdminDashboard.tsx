import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs'
import { useDivisions } from '@/features/divisions/useDivisions'
import { useNewsEvents } from '@/features/news-events/useNewsEvents'
import { useUnreadCount } from '@/features/notifications/useNotifications'
import { useUsers } from '@/features/users/useUsers'
import { Activity, ArrowRight, Bell, Building2, CalendarCheck, Newspaper, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

// Relative imports for local dialogs/wizards and hooks
import { useBookings } from '@/features/bookings/useBookings'

// Additional shared component import


export function AdminDashboard() {
  const { data: usersData } = useUsers({ perPage: 1 })
  const { data: divisionsData } = useDivisions({ perPage: 1, isActive: true })
  const { data: bookingsData } = useBookings({ perPage: 1, status: 'PENDING' })
  const { data: unreadCount } = useUnreadCount()
  const { data: auditLogs } = useAuditLogs({ perPage: 5 })
  const { data: publishedNewsEvents } = useNewsEvents({ status: 'PUBLISHED', perPage: 1 })

  const stats = [
    {
      label: 'Total Users',
      value: usersData?.total ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/users',
    },
    {
      label: 'Active Divisions',
      value: divisionsData?.total ?? 0,
      icon: Building2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/divisions',
    },
    {
      label: 'Pending Bookings',
      value: bookingsData?.total ?? 0,
      icon: CalendarCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      link: '/bookings',
    },
    {
      label: 'Published News & Events',
      value: publishedNewsEvents?.total ?? 0,
      icon: Newspaper,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      link: '/news',
    },
    {
      label: 'Unread Notifications',
      value: unreadCount ?? 0,
      icon: Bell,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/notifications',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Admin Dashboard" text="System overview and quick actions." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{String(stat.value)}</div>
              <Button variant="link" className="px-0 h-auto text-xs text-muted-foreground mt-2" asChild>
                <Link to={stat.link}>
                  View details <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system audit logs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs?.data.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 p-1 rounded-full bg-muted">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="grid gap-1">
                    <p className="font-medium leading-none">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      User: {log.performedBy.slice(0, 8)}... • {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {!auditLogs?.data.length && (
                <p className="text-center text-muted-foreground py-4">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access primary features quickly.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { label: 'Manage Users', path: '/users' },
              { label: 'Division Categories', path: '/division-categories' },
              { label: 'Service Categories', path: '/service-categories' },
              { label: 'Manage Divisions', path: '/divisions' },
              { label: 'Review Bookings', path: '/bookings' },
              { label: 'System Logs', path: '/audit-logs' },
            ].map((link) => (
              <Button key={link.label} variant="outline" className="justify-start" asChild>
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
