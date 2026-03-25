import StatusPill from '@/components/system/StatusPill'
import type { NotificationUrgency } from '@/types/notification.types'

type UrgencyBadgeProps = {
  urgency: NotificationUrgency
}

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const tone =
    urgency === 'LOW'
      ? 'slate'
      : urgency === 'MEDIUM'
        ? 'blue'
        : urgency === 'HIGH'
          ? 'amber'
          : 'red'

  return <StatusPill label={urgency} tone={tone} />
}
