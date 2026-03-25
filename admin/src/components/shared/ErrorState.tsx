import AppButton from '@/components/system/AppButton'
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
    <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-destructive/30 bg-white/70 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-destructive ring-1 ring-destructive/20">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-lg font-semibold text-destructive">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {onRetry ? (
        <AppButton className="mt-4" onClick={onRetry} variant="outline">
          Retry
        </AppButton>
      ) : null}
    </div>
  )
}
