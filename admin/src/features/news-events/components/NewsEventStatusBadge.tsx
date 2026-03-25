import StatusPill from '@/components/system/StatusPill'
import type { NewsEventStatus } from '@/types/news-events.types'

type Props = {
  status: NewsEventStatus
}

export default function NewsEventStatusBadge({ status }: Props) {
  if (status === 'PUBLISHED') {
    return <StatusPill label="Published" tone="emerald" />
  }

  return <StatusPill label="Draft" tone="slate" />
}
