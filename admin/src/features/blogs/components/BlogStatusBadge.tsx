import StatusPill from '@/components/system/StatusPill'
import type { BlogStatus } from '@/types/blogs.types'

export default function BlogStatusBadge({ status }: { status: BlogStatus }) {
  switch (status) {
    case 'PUBLISHED':
      return <StatusPill label="Published" tone="emerald" />
    case 'PENDING_REVIEW':
      return <StatusPill label="Pending Review" tone="amber" />
    case 'REJECTED':
      return <StatusPill label="Rejected" tone="red" />
    default:
      return <StatusPill label="Draft" tone="slate" />
  }
}
