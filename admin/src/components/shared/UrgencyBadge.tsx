import { Badge } from '@/components/ui/badge'
import type { NotificationUrgency } from '@/types/notification.types'

const urgencyClasses: Record<NotificationUrgency, string> = {
  LOW: 'bg-zinc-500 text-white hover:bg-zinc-500',
  MEDIUM: 'bg-blue-600 text-white hover:bg-blue-600',
  HIGH: 'bg-orange-600 text-white hover:bg-orange-600',
  CRITICAL: 'bg-red-600 text-white hover:bg-red-600',
}

type UrgencyBadgeProps = {
  urgency: NotificationUrgency
}

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return <Badge className={urgencyClasses[urgency]}>{urgency}</Badge>
}
