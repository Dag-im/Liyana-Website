import { Badge } from '@/components/ui/badge';
import type { BookingStatus } from '@/types/booking.types';

type StatusBadgeProps =
  | { type: 'active'; isActive: boolean; activeText?: string; inactiveText?: string }
  | { type: 'booking'; status: BookingStatus }
  | { type: 'read'; isRead: boolean }

export function StatusBadge(props: StatusBadgeProps) {
  if (props.type === 'active') {
    return (
      <Badge variant={props.isActive ? 'default' : 'secondary'}>
        {props.isActive ? (props.activeText ?? 'Active') : (props.inactiveText ?? 'Inactive')}
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
      return <Badge className="border-0 bg-amber-500 text-white hover:bg-amber-600">Pending</Badge>
    case 'CONFIRMED':
      return <Badge className="border-0 bg-emerald-600 text-white hover:bg-emerald-700">Confirmed</Badge>
    case 'CANCELLED':
      return <Badge variant="secondary">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
