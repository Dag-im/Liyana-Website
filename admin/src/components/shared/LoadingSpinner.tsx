import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type LoadingSpinnerProps = {
  fullPage?: boolean
  className?: string
  text?: string
}

export default function LoadingSpinner({
  fullPage = false,
  className,
  text = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-8 text-slate-500',
        fullPage && 'min-h-[60vh]',
        className,
      )}
    >
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <p className="text-xs uppercase tracking-[0.2em]">{text}</p>
    </div>
  )
}
