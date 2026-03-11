import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { BookingStatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBookings } from '@/features/bookings/useBookings';
import type { User } from '@/types/user.types';
import {
  ArrowRight,
  Building,
  CalendarCheck,
  CalendarDays,
  CalendarX,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CustomerServiceDashboard({ user }: { user: User }) {
  const { data: pendingData } = useBookings({ perPage: 1, status: 'PENDING' });
  const { data: confirmedData } = useBookings({
    perPage: 1,
    status: 'CONFIRMED',
  });
  const { data: cancelledData } = useBookings({
    perPage: 1,
    status: 'CANCELLED',
  });
  const { data: recentBookings } = useBookings({ perPage: 5 });

  const stats = [
    {
      label: 'Pending Bookings',
      value: pendingData?.total ?? 0,
      icon: CalendarDays,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Confirmed Bookings',
      value: confirmedData?.total ?? 0,
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Cancelled Bookings',
      value: cancelledData?.total ?? 0,
      icon: CalendarX,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          heading={`Welcome, ${user.name}`}
          text="Manage bookings for your division."
        />
        <Card className="min-w-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assigned Division</p>
              <p className="font-semibold">
                {user.division?.name || 'All Divisions'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking requests received.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/bookings">
              Manage All Bookings <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={recentBookings?.data || []}
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
                cell: ({ row }: any) => (
                  <BookingStatusBadge status={row.original.status} />
                ),
              },
              {
                header: 'Date',
                id: 'createdAt',
                cell: ({ row }: any) =>
                  new Date(row.original.createdAt).toLocaleDateString(),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
