import { Badge } from '@/components/ui/badge'
import type { NotificationUrgency } from '@/types/notification.types'

const urgencyClasses: Record<NotificationUrgency, string> = {
  LOW: 'bg-slate-500 text-white hover:bg-slate-600',
  MEDIUM: 'bg-primary text-primary-foreground hover:bg-primary/90',
  HIGH: 'bg-orange-600 text-white hover:bg-orange-700',
  CRITICAL: 'bg-destructive text-white hover:bg-destructive/90',
}

type UrgencyBadgeProps = {
  urgency: NotificationUrgency
}

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return <Badge className={urgencyClasses[urgency]}>{urgency}</Badge>
}
