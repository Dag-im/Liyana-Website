import { Badge } from '@/components/ui/badge'
import type { BlogStatus } from '@/types/blogs.types'

export default function BlogStatusBadge({ status }: { status: BlogStatus }) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-emerald-100 text-emerald-700">Published</Badge>
    case 'PENDING_REVIEW':
      return <Badge className="bg-amber-100 text-amber-700">Pending Review</Badge>
    case 'REJECTED':
      return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
    default:
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Draft</Badge>
  }
}
