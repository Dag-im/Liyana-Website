import DataTable from '@/components/shared/DataTable'
import { BookingStatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { useBookings } from '@/features/bookings/useBookings'
import { useContactSubmissions } from '@/features/contact/useContact'
import type { BookingStatus } from '@/types/booking.types'
import type { User } from '@/types/user.types'
import { CalendarCheck, CalendarClock, CalendarDays, CalendarX, Inbox, ListChecks } from 'lucide-react'

import { DashboardHero, MetricCard, QuickActionGrid, SectionCard } from './DashboardPrimitives'

export function CustomerServiceDashboard({ user }: { user: User }) {
  const { data: pendingData } = useBookings({ perPage: 1, status: 'PENDING' })
  const { data: confirmedData } = useBookings({ perPage: 1, status: 'CONFIRMED' })
  const { data: cancelledData } = useBookings({ perPage: 1, status: 'CANCELLED' })
  const recentBookingsQuery = useBookings({ perPage: 6 })
  const { data: unreviewedContact } = useContactSubmissions({ isReviewed: false, perPage: 1 })

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Front Desk"
        title={`Welcome back, ${user.name}`}
        description="Track booking flow, keep queue times low, and close inbound requests quickly."
        chips={[
          `Division: ${user.division?.name ?? 'All Divisions'}`,
          `${pendingData?.total ?? 0} pending bookings`,
          `${unreviewedContact?.total ?? 0} unreviewed messages`,
        ]}
        actions={[
          { label: 'Open Booking Queue', to: '/bookings' },
          { label: 'Open Contact Inbox', to: '/contact', variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pending"
          value={pendingData?.total ?? 0}
          description="New requests awaiting review"
          icon={CalendarDays}
          tone="amber"
          to="/bookings"
        />
        <MetricCard
          title="Confirmed"
          value={confirmedData?.total ?? 0}
          description="Appointments validated"
          icon={CalendarCheck}
          tone="emerald"
          to="/bookings"
        />
        <MetricCard
          title="Cancelled"
          value={cancelledData?.total ?? 0}
          description="Requires follow-up"
          icon={CalendarX}
          tone="rose"
          to="/bookings"
        />
        <MetricCard
          title="Unreviewed Contact"
          value={unreviewedContact?.total ?? 0}
          description="Shared inbox messages"
          icon={Inbox}
          tone={(unreviewedContact?.total ?? 0) > 0 ? 'rose' : 'default'}
          to="/contact"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Recent Booking Requests"
          description="Latest requests sorted by creation time"
          action={{ label: 'Manage all', to: '/bookings' }}
          className="xl:col-span-8"
        >
          <DataTable
            data={recentBookingsQuery.data?.data ?? []}
            isLoading={recentBookingsQuery.isLoading}
            isError={recentBookingsQuery.isError}
            onRetry={() => recentBookingsQuery.refetch()}
            columns={[
              {
                header: 'Patient',
                accessorKey: 'patientName',
              },
              {
                header: 'Selection',
                accessorKey: 'selectionLabel',
              },
              {
                header: 'Status',
                id: 'status',
                cell: ({ row }: { row: { original: { status: BookingStatus } } }) => (
                  <BookingStatusBadge status={row.original.status} />
                ),
              },
              {
                header: 'Created',
                id: 'createdAt',
                cell: ({ row }: { row: { original: { createdAt: string } } }) => (
                  <span className="text-sm">{new Date(row.original.createdAt).toLocaleString()}</span>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Service Operations"
          description="Common actions for customer service"
          className="xl:col-span-4"
        >
          <QuickActionGrid
            actions={[
              { label: 'Booking Queue', to: '/bookings', icon: ListChecks },
              { label: 'Notifications', to: '/notifications', icon: CalendarClock },
              { label: 'Contact Submissions', to: '/contact', icon: Inbox },
            ]}
          />
          <div className="mt-4 rounded-lg border border-border/70 bg-background/70 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Coverage</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">Bookings</Badge>
              <Badge variant="outline">Notifications</Badge>
              <Badge variant="outline">Contact Queue</Badge>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
