import { Badge } from '@/components/ui/badge';
import type { BookingStatus } from '@/types/booking.types';

type StatusBadgeProps =
  | { type: 'active'; isActive: boolean }
  | { type: 'booking'; status: BookingStatus }
  | { type: 'read'; isRead: boolean }

export function StatusBadge(props: StatusBadgeProps) {
  if (props.type === 'active') {
    return (
      <Badge variant={props.isActive ? 'default' : 'secondary'}>
        {props.isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  if (props.type === 'read') {
    return (
      <Badge variant={props.isRead ? 'secondary' : 'default'}>
        {props.isRead ? 'Read' : 'Unread'}
      </Badge>
    )
  }

  return <BookingStatusBadge status={props.status} />
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">Pending</Badge>
    case 'CONFIRMED':
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Confirmed</Badge>
    case 'CANCELLED':
      return <Badge variant="secondary">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
