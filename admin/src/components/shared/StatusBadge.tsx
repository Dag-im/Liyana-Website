import StatusPill from '@/components/system/StatusPill';
import type { BookingStatus } from '@/types/booking.types';

type StatusBadgeProps =
  | { type: 'active'; isActive: boolean; activeText?: string; inactiveText?: string }
  | { type: 'booking'; status: BookingStatus }
  | { type: 'read'; isRead: boolean }

export function StatusBadge(props: StatusBadgeProps) {
  if (props.type === 'active') {
    return (
      <StatusPill
        label={
          props.isActive ? (props.activeText ?? 'Active') : (props.inactiveText ?? 'Inactive')
        }
        tone={props.isActive ? 'emerald' : 'slate'}
      />
    )
  }

  if (props.type === 'read') {
    return (
      <StatusPill label={props.isRead ? 'Read' : 'Unread'} tone={props.isRead ? 'slate' : 'blue'} />
    )
  }

  return <BookingStatusBadge status={props.status} />
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case 'PENDING':
      return <StatusPill label="Pending" tone="amber" />
    case 'CONFIRMED':
      return <StatusPill label="Confirmed" tone="emerald" />
    case 'CANCELLED':
      return <StatusPill label="Cancelled" tone="red" />
    default:
      return <StatusPill label={status} tone="slate" />
  }
}
