import { useQueryClient } from '@tanstack/react-query'
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  FolderTree,
  Image,
  Inbox,
  MessageSquare,
  Milestone,
  Network,
  Newspaper,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs'
import { useAwards } from '@/features/awards/useAwards'
import { useBookings } from '@/features/bookings/useBookings'
import { useContactSubmissions } from '@/features/contact/useContact'
import { useNetworkMeta } from '@/features/corporate-network/useNetworkEntities'
import { useDivisions } from '@/features/divisions/useDivisions'
import { useMediaFolders } from '@/features/media/useMedia'
import { useNewsEvents } from '@/features/news-events/useNewsEvents'
import { useTeamMembers } from '@/features/team/useTeam'
import { useTestimonials } from '@/features/testimonials/useTestimonials'
import { useTimelineItems } from '@/features/timeline/useTimeline'
import { useUsers } from '@/features/users/useUsers'
import type { CoreValue, MissionVision, QualityPolicy, Stat, WhoWeAre } from '@/types/cms.types'
import { formatEnumLabel } from '@/lib/utils'

import { DashboardHero, MetricCard, QuickActionGrid, SectionCard } from './DashboardPrimitives'

export function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data: usersData } = useUsers({ perPage: 1 })
  const { data: divisionsData } = useDivisions({ perPage: 1, isActive: true })
  const { data: bookingsData } = useBookings({ perPage: 1, status: 'PENDING' })
  const { data: auditLogs } = useAuditLogs({ perPage: 6 })
  const { data: publishedNewsEvents } = useNewsEvents({ status: 'PUBLISHED', perPage: 1 })
  const { data: metaData } = useNetworkMeta()
  const { data: mediaData } = useMediaFolders({ perPage: 1 })
  const { data: teamData } = useTeamMembers({ perPage: 1, includeHidden: true })
  const { data: pendingTestimonials } = useTestimonials({ isApproved: false, perPage: 1 })
  const { data: unreviewedContact } = useContactSubmissions({ isReviewed: false, perPage: 1 })
  const { data: awardsData } = useAwards({ perPage: 1 })
  const { data: timelineData } = useTimelineItems({ perPage: 1 })

  const missionVision = queryClient.getQueryData<MissionVision>(['cms', 'mission-vision'])
  const whoWeAre = queryClient.getQueryData<WhoWeAre>(['cms', 'who-we-are'])
  const coreValues = queryClient.getQueryData<CoreValue[]>(['cms', 'core-values']) ?? []
  const statsValues = queryClient.getQueryData<Stat[]>(['cms', 'stats']) ?? []
  const qualityPolicies = queryClient.getQueryData<QualityPolicy[]>(['cms', 'quality-policy']) ?? []

  const pendingWork = (bookingsData?.total ?? 0) + (pendingTestimonials?.total ?? 0) + (unreviewedContact?.total ?? 0)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Control Center"
        title="Admin Operations Dashboard"
        description="Monitor platform health, approvals, and critical workflows from one operational cockpit."
        chips={[
          `${pendingWork} pending reviews`,
          `${metaData?.totalEntities ?? 0} network entities`,
          `${usersData?.total ?? 0} users`,
        ]}
        actions={[
          { label: 'Open Audit Logs', to: '/audit-logs', variant: 'outline' },
          { label: 'Open CMS', to: '/cms' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={usersData?.total ?? 0}
          description="Across all roles"
          icon={Users}
          tone="indigo"
          to="/users"
        />
        <MetricCard
          title="Active Divisions"
          value={divisionsData?.total ?? 0}
          description="Operational departments"
          icon={Building2}
          tone="emerald"
          to="/divisions"
        />
        <MetricCard
          title="Pending Bookings"
          value={bookingsData?.total ?? 0}
          description="Requires customer-service review"
          icon={CalendarCheck}
          tone="amber"
          to="/bookings"
        />
        <MetricCard
          title="Unreviewed Contact"
          value={unreviewedContact?.total ?? 0}
          description="Inbound messages to triage"
          icon={Inbox}
          tone={(unreviewedContact?.total ?? 0) > 0 ? 'rose' : 'default'}
          to="/contact"
        />
        <MetricCard
          title="Published News & Events"
          value={publishedNewsEvents?.total ?? 0}
          description="Public-facing entries"
          icon={Newspaper}
          tone="cyan"
          to="/news"
        />
        <MetricCard
          title="Media Folders"
          value={mediaData?.total ?? 0}
          description="Managed gallery collections"
          icon={Image}
          tone="indigo"
          to="/media"
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
          title="Network Entities"
          value={metaData?.totalEntities ?? 0}
          description={`Version ${metaData?.version ?? 'n/a'}`}
          icon={Network}
          tone="cyan"
          to="/corporate-network"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Recent Activity"
          description="Latest audited actions in the platform"
          action={{ label: 'View all logs', to: '/audit-logs' }}
          className="xl:col-span-7"
        >
          <div className="space-y-2">
            {auditLogs?.data?.length ? (
              auditLogs.data.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/70 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium">{formatEnumLabel(log.action)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()} by {log.performedBy.slice(0, 8)}...
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px] uppercase">
                    {log.entityType}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No activity found.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Core Areas"
          description="Fast navigation to high-frequency modules"
          className="xl:col-span-5"
        >
          <QuickActionGrid
            actions={[
              { label: 'Users', to: '/users', icon: Users },
              { label: 'Bookings', to: '/bookings', icon: CalendarCheck },
              { label: 'Divisions', to: '/divisions', icon: Building2 },
              { label: 'Service Categories', to: '/service-categories', icon: FolderTree },
              { label: 'Corporate Network', to: '/corporate-network', icon: Network },
              { label: 'News', to: '/news', icon: Newspaper },
              { label: 'Blogs', to: '/blogs', icon: BookOpen },
              { label: 'Media', to: '/media', icon: Image },
              { label: 'Timeline', to: '/timeline', icon: Milestone },
              { label: 'Awards', to: '/awards', icon: Award },
              { label: 'Notifications', to: '/notifications', icon: Bell },
              { label: 'CMS', to: '/cms', icon: ClipboardCheck },
            ]}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Content Integrity"
        description="Readiness checks for CMS-driven sections"
        className="border-dashed"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <IntegrityItem label="Mission & Vision" value={missionVision ? 'Ready' : 'Missing'} />
          <IntegrityItem label="Who We Are" value={whoWeAre ? 'Ready' : 'Missing'} />
          <IntegrityItem label="Core Values" value={`${coreValues.length} items`} />
          <IntegrityItem label="Stats" value={`${statsValues.length} items`} />
          <IntegrityItem label="Quality Policies" value={`${qualityPolicies.length} locales`} />
          <IntegrityItem label="Team Records" value={`${teamData?.total ?? 0} members`} />
          <IntegrityItem label="Awards" value={`${awardsData?.total ?? 0} records`} />
          <IntegrityItem label="Timeline" value={`${timelineData?.total ?? 0} milestones`} />
          <IntegrityItem label="Testimonials" value={`${pendingTestimonials?.total ?? 0} pending`} />
          <IntegrityItem label="Contact Queue" value={`${unreviewedContact?.total ?? 0} open`} />
        </div>
      </SectionCard>
    </div>
  )
}

function IntegrityItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/70 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}
