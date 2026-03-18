import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { useAuditLogs } from '@/features/audit-logs/useAuditLogs'
import { useDivisions } from '@/features/divisions/useDivisions'
import { useNewsEvents } from '@/features/news-events/useNewsEvents'
import { useUsers } from '@/features/users/useUsers'
import { useMediaFolders } from '@/features/media/useMedia'
import type { CoreValue, MissionVision, QualityPolicy, Stat, WhoWeAre } from '@/types/cms.types'
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  History,
  Newspaper,
  Users,
  Network,
  Image,
  UserCircle,
  MessageSquare,
  Inbox,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNetworkMeta } from '@/features/corporate-network/useNetworkEntities'
import { useTeamMembers } from '@/features/team/useTeam'
import { useAwards } from '@/features/awards/useAwards'
import { useTimelineItems } from '@/features/timeline/useTimeline'

import { useBookings } from '@/features/bookings/useBookings'
import { useContactSubmissions } from '@/features/contact/useContact'
import { useTestimonials } from '@/features/testimonials/useTestimonials'


export function AdminDashboard() {
  const queryClient = useQueryClient()
  const { data: usersData } = useUsers({ perPage: 1 })
  const { data: divisionsData } = useDivisions({ perPage: 1, isActive: true })
  const { data: bookingsData } = useBookings({ perPage: 1, status: 'PENDING' })
  const { data: auditLogs } = useAuditLogs({ perPage: 5 })
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
      label: 'Network Entities',
      value: metaData?.totalEntities ?? 0,
      icon: Network,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      link: '/corporate-network',
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
      label: 'Media Folders',
      value: mediaData?.total ?? 0,
      icon: Image,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/media',
    },
    {
      label: 'Team Members',
      value: teamData?.total ?? 0,
      icon: UserCircle,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50',
      link: '/team',
    },
    {
      label: 'Pending Testimonials',
      value: pendingTestimonials?.total ?? 0,
      icon: MessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      link: '/testimonials',
    },
    {
      label: 'Unreviewed Contact',
      value: unreviewedContact?.total ?? 0,
      icon: Inbox,
      color: (unreviewedContact?.total ?? 0) > 0 ? 'text-red-600' : 'text-slate-600',
      bg: (unreviewedContact?.total ?? 0) > 0 ? 'bg-red-50' : 'bg-slate-50',
      link: '/contact',
    },
    {
      label: 'Awards',
      value: awardsData?.total ?? 0,
      icon: Award,
      color: 'text-violet-700',
      bg: 'bg-violet-50',
      link: '/awards',
    },
    {
      label: 'Timeline Entries',
      value: timelineData?.total ?? 0,
      icon: History,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      link: '/timeline',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader heading="Admin Dashboard" text="System overview and quick actions." />

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
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
        <Card className="md:col-span-4">
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

        <Card className="md:col-span-2">
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
              { label: 'Corporate Network', path: '/corporate-network' },
              { label: 'Media Gallery', path: '/media' },
              { label: 'Team & Leadership', path: '/team' },
              { label: 'Review Bookings', path: '/bookings' },
              { label: 'System Logs', path: '/audit-logs' },
              { label: 'Testimonials', path: '/testimonials' },
              { label: 'Contact Submissions', path: '/contact' },
              { label: 'Awards', path: '/awards' },
              { label: 'Timeline', path: '/timeline' },
              { label: 'FAQs', path: '/faqs' },
              { label: 'CMS', path: '/cms' },
            ].map((link) => (
              <Button key={link.label} variant="outline" className="justify-start" asChild>
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Content Health</CardTitle>
            <CardDescription>Cached CMS coverage status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Mission/Vision</span>
              <span>{missionVision ? '✓' : '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Who We Are</span>
              <span>{whoWeAre ? '✓' : '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Core Values</span>
              <span>{coreValues.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Stats</span>
              <span>{statsValues.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Policy Languages</span>
              <span>{qualityPolicies.length}</span>
            </div>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/cms">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Open CMS
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
