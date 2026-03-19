import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-destructive ring-1 ring-destructive/20">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-base font-semibold text-destructive">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} variant="outline">
          Retry
        </Button>
      ) : null}
    </div>
  )
}
