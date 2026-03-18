import { Link } from 'react-router-dom'

import DataTable from '@/components/shared/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewsEvents } from '@/features/news-events/useNewsEvents'
import { useUnreadCount } from '@/features/notifications/useNotifications'
import { formatDate, truncate } from '@/lib/utils'
import type { NewsEvent } from '@/types/news-events.types'
import { Bell, CalendarDays, FileText, Newspaper } from 'lucide-react'
import NewsEventStatusBadge from '@/features/news-events/components/NewsEventStatusBadge'
import { useTestimonials } from '@/features/testimonials/useTestimonials'
import { useContactSubmissions } from '@/features/contact/useContact'
import { MessageSquare, Inbox } from 'lucide-react'

export function CommunicationDashboard() {
  const { data: publishedNews } = useNewsEvents({ status: 'PUBLISHED', type: 'news', perPage: 1 })
  const { data: publishedEvents } = useNewsEvents({ status: 'PUBLISHED', type: 'event', perPage: 1 })
  const { data: draftEntries } = useNewsEvents({ status: 'DRAFT', perPage: 1 })
  const recentEntriesQuery = useNewsEvents({ perPage: 5, sortBy: 'createdAt', sortOrder: 'DESC' })
  const { data: unreadCount } = useUnreadCount()
  const { data: pendingTestimonials } = useTestimonials({ isApproved: false, perPage: 1 })
  const { data: unreviewedContact } = useContactSubmissions({ isReviewed: false, perPage: 1 })

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Communication Dashboard" text="Manage news and events content." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published News</CardTitle>
            <Newspaper className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedNews?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedEvents?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Entries</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftEntries?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Pending Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTestimonials?.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${(unreviewedContact?.total ?? 0) > 0 ? 'text-red-600' : ''}`}>
              Unreviewed Submissions
            </CardTitle>
            <Inbox className={`h-4 w-4 ${(unreviewedContact?.total ?? 0) > 0 ? 'text-red-600' : 'text-slate-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreviewedContact?.total ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  header: 'Title',
                  accessorKey: 'title',
                  cell: ({ row }: { row: { original: NewsEvent } }) => (
                    <span className="font-medium">{truncate(row.original.title, 60)}</span>
                  ),
                },
                {
                  header: 'Type',
                  accessorKey: 'type',
                  cell: ({ row }: { row: { original: NewsEvent } }) => (
                    <Badge variant="outline">
                      {row.original.type === 'event' ? 'Event' : 'News'}
                    </Badge>
                  ),
                },
                {
                  header: 'Status',
                  accessorKey: 'status',
                  cell: ({ row }: { row: { original: NewsEvent } }) => (
                    <NewsEventStatusBadge status={row.original.status} />
                  ),
                },
                {
                  header: 'Date',
                  accessorKey: 'date',
                  cell: ({ row }: { row: { original: NewsEvent } }) => formatDate(row.original.date),
                },
              ]}
              data={recentEntriesQuery.data?.data ?? []}
              isLoading={recentEntriesQuery.isLoading}
              isError={recentEntriesQuery.isError}
              onRetry={() => recentEntriesQuery.refetch()}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/news">Go to News</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/events">Go to Events</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/notifications">View Notifications</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/corporate-network">Corporate Network</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/team">Team & Leadership</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/testimonials">Review Testimonials</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/contact">View Submissions</Link>
          </Button>
          <Button variant="outline" className="justify-start" asChild>
            <Link to="/media">Go to Media Gallery</Link>
          </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Bell className="h-4 w-4 text-purple-600" />
              Unread notifications: {typeof unreadCount === 'number' ? unreadCount : (unreadCount?.count ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
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
