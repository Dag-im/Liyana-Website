import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { useBlogs } from '@/features/blogs/useBlogs'
import BlogStatusBadge from '@/features/blogs/components/BlogStatusBadge'
import { useContactSubmissions } from '@/features/contact/useContact'
import NewsEventStatusBadge from '@/features/news-events/components/NewsEventStatusBadge'
import { useNewsEvents } from '@/features/news-events/useNewsEvents'
import { useNotifications, useUnreadCount } from '@/features/notifications/useNotifications'
import { useTestimonials } from '@/features/testimonials/useTestimonials'
import type { NewsEvent } from '@/types/news-events.types'
import type { Notification } from '@/types/notification.types'
import type { User } from '@/types/user.types'
import {
  Bell,
  BookOpen,
  CalendarDays,
  FilePlus2,
  FileText,
  Inbox,
  MessageSquare,
  Newspaper,
  RadioTower,
} from 'lucide-react'

import { DashboardHero, MetricCard, QuickActionGrid, SectionCard } from './DashboardPrimitives'

export function CommunicationDashboard({ user }: { user: User }) {
  const { data: publishedNews } = useNewsEvents({ status: 'PUBLISHED', type: 'news', perPage: 1 })
  const { data: publishedEvents } = useNewsEvents({ status: 'PUBLISHED', type: 'event', perPage: 1 })
  const { data: draftEntries } = useNewsEvents({ status: 'DRAFT', perPage: 1 })
  const recentEntriesQuery = useNewsEvents({ perPage: 6, sortBy: 'createdAt', sortOrder: 'DESC' })
  const { data: pendingTestimonials } = useTestimonials({ isApproved: false, perPage: 1 })
  const { data: unreviewedContact } = useContactSubmissions({ isReviewed: false, perPage: 1 })
  const { data: unreadCount } = useUnreadCount()
  const unread = typeof unreadCount === 'number' ? unreadCount : (unreadCount?.count ?? 0)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Publishing"
        title={`Communication Dashboard, ${user.name}`}
        description="Keep the public narrative fresh, accurate, and on-brand across news, events, and media channels."
        chips={[
          `${publishedNews?.total ?? 0} news live`,
          `${publishedEvents?.total ?? 0} events live`,
          `${unread} unread notifications`,
        ]}
        actions={[
          { label: 'Create News', to: '/news/new' },
          { label: 'Create Event', to: '/events/new', variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Published News"
          value={publishedNews?.total ?? 0}
          description="Public news coverage"
          icon={Newspaper}
          tone="cyan"
          to="/news"
        />
        <MetricCard
          title="Published Events"
          value={publishedEvents?.total ?? 0}
          description="Live event pages"
          icon={CalendarDays}
          tone="emerald"
          to="/events"
        />
        <MetricCard
          title="Draft Entries"
          value={draftEntries?.total ?? 0}
          description="Content pending publication"
          icon={FileText}
          tone="amber"
          to="/news"
        />
        <MetricCard
          title="Unread Notifications"
          value={unread}
          description="Team updates and alerts"
          icon={Bell}
          tone={unread > 0 ? 'indigo' : 'default'}
          to="/notifications"
        />
        <MetricCard
          title="Pending Testimonials"
          value={pendingTestimonials?.total ?? 0}
          description="Awaiting moderation"
          icon={MessageSquare}
          tone="amber"
          to="/testimonials"
        />
        <MetricCard
          title="Unreviewed Contact"
          value={unreviewedContact?.total ?? 0}
          description="Inbound external inquiries"
          icon={Inbox}
          tone={(unreviewedContact?.total ?? 0) > 0 ? 'rose' : 'default'}
          to="/contact"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Recent News & Events"
          description="Most recent content entries"
          action={{ label: 'View all', to: '/news' }}
          className="xl:col-span-8"
        >
          <DataTable
            columns={[
              {
                header: 'Title',
                accessorKey: 'title',
                cell: ({ row }: { row: { original: NewsEvent } }) => (
                  <span className="font-medium">{row.original.title}</span>
                ),
              },
              {
                header: 'Type',
                id: 'type',
                cell: ({ row }: { row: { original: NewsEvent } }) => (
                  <Badge variant="outline" className="capitalize">{row.original.type}</Badge>
                ),
              },
              {
                header: 'Status',
                id: 'status',
                cell: ({ row }: { row: { original: NewsEvent } }) => (
                  <NewsEventStatusBadge status={row.original.status} />
                ),
              },
              {
                header: 'Date',
                id: 'date',
                cell: ({ row }: { row: { original: NewsEvent } }) => (
                  <span className="text-sm">{new Date(row.original.date).toLocaleDateString()}</span>
                ),
              },
            ]}
            data={recentEntriesQuery.data?.data ?? []}
            isLoading={recentEntriesQuery.isLoading}
            isError={recentEntriesQuery.isError}
            onRetry={() => recentEntriesQuery.refetch()}
          />
        </SectionCard>

        <SectionCard
          title="Communication Shortcuts"
          description="Common editorial and media tasks"
          className="xl:col-span-4"
        >
          <QuickActionGrid
            actions={[
              { label: 'News', to: '/news', icon: Newspaper },
              { label: 'Events', to: '/events', icon: CalendarDays },
              { label: 'Media Gallery', to: '/media', icon: RadioTower },
              { label: 'Team & Leadership', to: '/team', icon: BookOpen },
              { label: 'Testimonials', to: '/testimonials', icon: MessageSquare },
              { label: 'Contact Inbox', to: '/contact', icon: Inbox },
              { label: 'Notifications', to: '/notifications', icon: Bell },
              { label: 'Create Entry', to: '/news/new', icon: FilePlus2 },
            ]}
          />
        </SectionCard>
      </div>
    </div>
  )
}

export function HrDashboard({ user }: { user: User }) {
  const notificationsQuery = useNotifications({ perPage: 6, sortBy: 'createdAt', sortOrder: 'DESC' })
  const { data: unreadCount } = useUnreadCount()
  const unread = typeof unreadCount === 'number' ? unreadCount : (unreadCount?.count ?? 0)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Workflows"
        title={`HR Dashboard, ${user.name}`}
        description="Track operational communications and handle cross-team notifications efficiently."
        chips={[`Role: ${user.role}`, `${unread} unread notifications`]}
        actions={[{ label: 'Open Notifications', to: '/notifications' }]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Unread Notifications"
          value={unread}
          description="Need review"
          icon={Bell}
          tone={unread > 0 ? 'amber' : 'default'}
          to="/notifications"
        />
        <MetricCard
          title="Latest Updates"
          value={notificationsQuery.data?.data?.length ?? 0}
          description="Loaded in your feed"
          icon={RadioTower}
          tone="indigo"
          to="/notifications"
        />
        <MetricCard
          title="Account Status"
          value={user.isActive ? 'Active' : 'Inactive'}
          description={`Member since ${new Date(user.createdAt).toLocaleDateString()}`}
          icon={BookOpen}
          tone={user.isActive ? 'emerald' : 'rose'}
        />
      </div>

      <SectionCard
        title="Recent Notifications"
        description="Most recent alerts sent to your role"
        action={{ label: 'View all', to: '/notifications' }}
      >
        <DataTable
          data={notificationsQuery.data?.data ?? []}
          isLoading={notificationsQuery.isLoading}
          isError={notificationsQuery.isError}
          onRetry={() => notificationsQuery.refetch()}
          columns={[
            {
              header: 'Title',
              cell: ({ row }: { row: { original: Notification } }) => (
                <span className="font-medium">{row.original.title}</span>
              ),
            },
            {
              header: 'Urgency',
              id: 'urgency',
              cell: ({ row }: { row: { original: Notification } }) => (
                <Badge variant="outline" className="uppercase text-[10px]">
                  {row.original.urgency}
                </Badge>
              ),
            },
            {
              header: 'Date',
              id: 'createdAt',
              cell: ({ row }: { row: { original: Notification } }) => (
                <span className="text-sm">{new Date(row.original.createdAt).toLocaleString()}</span>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  )
}

export function BloggerDashboard({ user }: { user: User }) {
  const drafts = useBlogs({ authorId: user.id, status: 'DRAFT', perPage: 1 })
  const pending = useBlogs({ authorId: user.id, status: 'PENDING_REVIEW', perPage: 1 })
  const published = useBlogs({ authorId: user.id, status: 'PUBLISHED', perPage: 1 })
  const rejected = useBlogs({ authorId: user.id, status: 'REJECTED', perPage: 1 })
  const recentBlogs = useBlogs({ authorId: user.id, perPage: 6, sortBy: 'updatedAt', sortOrder: 'DESC' })
  const { data: unreadCount } = useUnreadCount()
  const unread = typeof unreadCount === 'number' ? unreadCount : (unreadCount?.count ?? 0)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Editorial"
        title={`Blogger Workspace, ${user.name}`}
        description="Create, refine, and publish content with a clear pipeline from draft to production."
        chips={[
          `${drafts.data?.total ?? 0} drafts`,
          `${pending.data?.total ?? 0} in review`,
          `${unread} unread notifications`,
        ]}
        actions={[
          { label: 'Write New Post', to: '/blogs/new' },
          { label: 'Open Blog List', to: '/blogs', variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Draft"
          value={drafts.data?.total ?? 0}
          description="Editable working posts"
          icon={FileText}
          tone="amber"
          to="/blogs"
        />
        <MetricCard
          title="Pending Review"
          value={pending.data?.total ?? 0}
          description="Awaiting editorial approval"
          icon={Inbox}
          tone="indigo"
          to="/blogs"
        />
        <MetricCard
          title="Published"
          value={published.data?.total ?? 0}
          description="Live public posts"
          icon={Newspaper}
          tone="emerald"
          to="/blogs"
        />
        <MetricCard
          title="Rejected"
          value={rejected.data?.total ?? 0}
          description="Needs revision"
          icon={MessageSquare}
          tone="rose"
          to="/blogs"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Recent Posts"
          description="Most recently updated posts in your queue"
          action={{ label: 'Open all posts', to: '/blogs' }}
          className="xl:col-span-8"
        >
          <DataTable
            data={recentBlogs.data?.data ?? []}
            isLoading={recentBlogs.isLoading}
            isError={recentBlogs.isError}
            onRetry={() => recentBlogs.refetch()}
            columns={[
              {
                header: 'Title',
                accessorKey: 'title',
                cell: ({ row }: { row: { original: { title: string } } }) => (
                  <span className="font-medium">{row.original.title}</span>
                ),
              },
              {
                header: 'Status',
                id: 'status',
                cell: ({ row }: { row: { original: { status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' } } }) => (
                  <BlogStatusBadge status={row.original.status} />
                ),
              },
              {
                header: 'Updated',
                id: 'updatedAt',
                cell: ({ row }: { row: { original: { updatedAt: string } } }) => (
                  <span className="text-sm">{new Date(row.original.updatedAt).toLocaleDateString()}</span>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Writing Shortcuts"
          description="Speed up common editorial actions"
          className="xl:col-span-4"
        >
          <QuickActionGrid
            actions={[
              { label: 'New Blog Post', to: '/blogs/new', icon: FilePlus2 },
              { label: 'Blog Library', to: '/blogs', icon: BookOpen },
              { label: 'Blog Categories', to: '/blogs/categories', icon: Newspaper },
              { label: 'Notifications', to: '/notifications', icon: Bell },
            ]}
          />
        </SectionCard>
      </div>
    </div>
  )
}
