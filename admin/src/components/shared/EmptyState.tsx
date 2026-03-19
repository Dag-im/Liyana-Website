import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

type EmptyStateProps = {
  title?: string
  description?: string
  icon?: ReactNode
}

export default function EmptyState({
  title = 'No data available',
  description = 'Nothing to show yet.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border/90 bg-muted/25 p-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border/80">
        {icon ?? <SearchX className="h-5 w-5" />}
      </div>
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
