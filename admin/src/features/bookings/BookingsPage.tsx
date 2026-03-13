import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingDetailDialog } from '@/features/bookings/BookingDetailDialog';
import { UpdateBookingStatusDialog } from '@/features/bookings/UpdateBookingStatusDialog';
import { useBookings } from '@/features/bookings/useBookings';
import { useDivisions } from '@/features/divisions/useDivisions';
import { usePagination } from '@/hooks/usePagination';
import { BOOKING_STATUSES } from '@/lib/constants';
import { formatEnumLabel } from '@/lib/utils';
import type { Booking } from '@/types/booking.types';
import { CheckCircle, Eye, FilterX } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function BookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, perPage, setPage } = usePagination();

  const divisionId = searchParams.get('divisionId') || undefined;
  // search is handled via searchParams in useBookings implicitly or we can ignore it if unused
  const status = (searchParams.get('status') as Booking['status']) || undefined;

  const { data: bookingsData, isLoading } = useBookings({
    page,
    perPage,
    divisionId,
    status: (searchParams.get('status') as Booking['status']) || undefined,
  });

  const { data: divisions } = useDivisions({ perPage: 100 });

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateFilters = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Bookings"
        text="Track and manage patient service requests."
      />

      <Card className="p-4 bg-muted/20">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Division</Label>
            <Select
              value={divisionId || 'all'}
              onValueChange={(v) => updateFilters('divisionId', v || undefined)}
            >
              <SelectTrigger className="w-50 h-9">
                <SelectValue placeholder="All Divisions">
                  {divisionId && divisionId !== 'all'
                    ? divisions?.data.find((d) => d.id === divisionId)?.name ??
                      'All Divisions'
                    : 'All Divisions'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions?.data.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select
              value={status || 'all'}
              onValueChange={(v) => updateFilters('status', v || undefined)}
            >
              <SelectTrigger className="w-45 h-9">
                <SelectValue placeholder="All Statuses">
                  {status ? formatEnumLabel(status) : 'All Statuses'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {BOOKING_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatEnumLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setPage(1);
            }}
          >
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </Card>

      <DataTable
        data={bookingsData?.data || []}
        loading={isLoading}
        pagination={{
          page,
          perPage,
          total: bookingsData?.total || 0,
          onPageChange: setPage,
        }}
        columns={[
          {
            header: 'Patient',
            accessorKey: 'patientName',
            cell: ({ row }: { row: { original: Booking } }) => (
              <div>
                <p className="font-medium">{row.original.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {row.original.patientPhone}
                </p>
              </div>
            ),
          },
          {
            header: 'Selection',
            accessorKey: 'selectionLabel',
            cell: ({ row }: { row: { original: Booking } }) => (
              <div>
                <p className="text-sm font-medium">
                  {row.original.selectionLabel}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {row.original.selectionType}
                </p>
              </div>
            ),
          },
          {
            header: 'Division',
            id: 'division',
            cell: ({ row }: { row: { original: Booking } }) =>
              row.original.divisionName || '-',
          },
          {
            header: 'Status',
            id: 'status',
            cell: ({ row }: { row: { original: Booking } }) => (
              <StatusBadge type="booking" status={row.original.status} />
            ),
          },
          {
            header: 'Received',
            id: 'createdAt',
            cell: ({ row }: { row: { original: Booking } }) => (
              <div className="flex flex-col text-xs">
                <span>
                  {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
                <span className="text-muted-foreground">
                  {new Date(row.original.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ),
          },
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: { original: Booking } }) => (
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedBooking(row.original)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {row.original.status === 'PENDING' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-primary hover:text-primary"
                    onClick={() => setUpdatingId(row.original.id)}
                    title="Update Status"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />

      {selectedBooking && (
        <BookingDetailDialog
          booking={selectedBooking}
          open={!!selectedBooking}
          onOpenChange={(open: boolean) => !open && setSelectedBooking(null)}
          onUpdateStatus={() => {
            setUpdatingId(selectedBooking.id);
            setSelectedBooking(null);
          }}
        />
      )}

      {updatingId && (
        <UpdateBookingStatusDialog
          id={updatingId}
          open={!!updatingId}
          onOpenChange={(open: boolean) => !open && setUpdatingId(null)}
        />
      )}
    </div>
  );
}
