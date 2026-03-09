import { Button } from '@/components/ui/button'

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
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-destructive/30 p-6 text-center">
      <p className="text-base font-medium text-destructive">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} variant="outline">
          Retry
        </Button>
      ) : null}
    </div>
  )
}
