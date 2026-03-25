import { Bell, CalendarCheck, CalendarClock, CalendarDays, FileText, Image, Info, Users } from 'lucide-react'
import { useState } from 'react'

import DataTable from '@/components/shared/DataTable'
import { BookingStatusBadge, StatusBadge } from '@/components/shared/StatusBadge'
import { useBookings } from '@/features/bookings/useBookings'
import { BookingDetailDialog } from '@/features/bookings/BookingDetailDialog'
import { useMyDivision } from '@/features/my-division/useMyDivision'
import { useMyTeam } from '@/features/my-division/useMyTeam'
import { useUnreadCount } from '@/features/notifications/useNotifications'
import type { Booking } from '@/types/booking.types'
import type { User } from '@/types/user.types'

import { DashboardHero, MetricCard, QuickActionGrid, SectionCard } from './DashboardPrimitives'

export function DivisionManagerDashboard({ user }: { user: User }) {
  const { data: division } = useMyDivision()
  const { data: pendingBookings } = useBookings({ perPage: 1, status: 'PENDING' })
  const { data: confirmedBookings } = useBookings({ perPage: 1, status: 'CONFIRMED' })
  const recentBookingsQuery = useBookings({ perPage: 5 })
  const { data: teamData } = useMyTeam({ perPage: 1 })
  const { data: unreadData } = useUnreadCount()

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Division Operations"
        title={`${division?.name ?? 'My Division'} Dashboard`}
        description="Manage your division profile, operations, and team from one workspace."
        chips={[
          `Manager: ${user.name}`,
          `Division: ${division?.shortName ?? 'N/A'}`,
          `${pendingBookings?.total ?? 0} pending bookings`,
          `${unreadData?.count ?? 0} unread notifications`,
        ]}
        actions={[
          { label: 'Edit Basics', to: '/my-division/basics' },
          { label: 'View Bookings', to: '/my-division/bookings', variant: 'outline' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Division"
          value={division?.name ?? 'Unknown'}
          description={division?.isActive ? 'Currently active' : 'Currently inactive'}
          icon={Info}
          tone="cyan"
          to="/my-division/basics"
        />
        <MetricCard
          title="Pending Bookings"
          value={pendingBookings?.total ?? 0}
          description="Awaiting triage"
          icon={CalendarDays}
          tone="amber"
          to="/my-division/bookings"
        />
        <MetricCard
          title="Confirmed Bookings"
          value={confirmedBookings?.total ?? 0}
          description="Scheduled requests"
          icon={CalendarCheck}
          tone="emerald"
          to="/my-division/bookings"
        />
        {division?.requiresMedicalTeam ? (
          <MetricCard
            title="Total Doctors"
            value={division.doctors.length}
            description="Active medical profiles"
            icon={FileText}
            tone="indigo"
            to="/my-division/medical-team"
          />
        ) : null}
        <MetricCard
          title="CS Team"
          value={teamData?.total ?? 0}
          description="Customer service users"
          icon={Users}
          tone="default"
          to="/my-division/team"
        />
        <MetricCard
          title="Unread Notifications"
          value={unreadData?.count ?? 0}
          description="Needs attention"
          icon={Bell}
          tone={(unreadData?.count ?? 0) > 0 ? 'rose' : 'default'}
          to="/notifications"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-8"
          title="Recent Bookings"
          description="Latest 5 booking requests for your division"
          action={{ label: 'Open queue', to: '/my-division/bookings' }}
        >
          <DataTable
            data={recentBookingsQuery.data?.data ?? []}
            isLoading={recentBookingsQuery.isLoading}
            isError={recentBookingsQuery.isError}
            onRetry={() => recentBookingsQuery.refetch()}
            onRowClick={(booking) => setSelectedBooking(booking)}
            columns={[
              {
                header: 'Patient Name',
                accessorKey: 'patientName',
              },
              {
                header: 'Division',
                accessorKey: 'divisionName',
              },
              {
                header: 'Selection',
                accessorKey: 'selectionLabel',
              },
              {
                header: 'Status',
                id: 'status',
                cell: ({ row }: { row: { original: Booking } }) => (
                  <BookingStatusBadge status={row.original.status} />
                ),
              },
              {
                header: 'Created At',
                id: 'createdAt',
                cell: ({ row }: { row: { original: Booking } }) => (
                  <span className="text-sm">{new Date(row.original.createdAt).toLocaleString()}</span>
                ),
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          title="Quick Links"
          description="Go directly to high-frequency tasks"
        >
          <QuickActionGrid
            actions={[
              { label: 'Edit Basics', to: '/my-division/basics', icon: Info },
              { label: 'Manage Media', to: '/my-division/media', icon: Image },
              { label: 'View Bookings', to: '/my-division/bookings', icon: CalendarClock },
              { label: 'My Team', to: '/my-division/team', icon: Users },
            ]}
          />

          {division ? (
            <div className="mt-4 rounded-lg border border-border/70 bg-background/70 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Division Status</p>
              <div className="mt-2">
                <StatusBadge type="active" isActive={division.isActive} />
              </div>
            </div>
          ) : null}
        </SectionCard>
      </div>

      {selectedBooking ? (
        <BookingDetailDialog
          booking={selectedBooking}
          open={Boolean(selectedBooking)}
          onOpenChange={(open) => {
            if (!open) setSelectedBooking(null)
          }}
          onUpdateStatus={() => {
            setSelectedBooking(null)
          }}
        />
      ) : null}
    </div>
  )
}
