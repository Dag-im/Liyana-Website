import { Badge } from '@/components/ui/badge'

type StatusBadgeProps = {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusBadge({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}: StatusBadgeProps) {
  return isActive ? (
    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">{activeLabel}</Badge>
  ) : (
    <Badge variant="secondary">{inactiveLabel}</Badge>
  )
}
