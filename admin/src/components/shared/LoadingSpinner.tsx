import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

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
        'flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground',
        fullPage && 'min-h-[60vh]',
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="text-xs">{text}</p>
    </div>
  )
}
