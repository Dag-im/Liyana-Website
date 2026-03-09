import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type LoadingSpinnerProps = {
  fullPage?: boolean
  className?: string
}

export default function LoadingSpinner({ fullPage = false, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-8 text-muted-foreground',
        fullPage && 'min-h-[60vh]',
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  )
}
