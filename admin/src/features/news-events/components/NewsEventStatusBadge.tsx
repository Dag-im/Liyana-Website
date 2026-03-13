import { Badge } from '@/components/ui/badge'
import type { NewsEventStatus } from '@/types/news-events.types'

type Props = {
  status: NewsEventStatus
}

export default function NewsEventStatusBadge({ status }: Props) {
  if (status === 'PUBLISHED') {
    return <Badge className="bg-emerald-100 text-emerald-700">Published</Badge>
  }

  return <Badge variant="secondary" className="bg-muted text-muted-foreground">Draft</Badge>
}
