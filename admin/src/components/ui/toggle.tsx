import * as React from 'react'
import { cn } from '@/lib/utils'

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        data-state={pressed ? 'on' : 'off'}
        className={cn(
          'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition-colors',
          'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          className,
        )}
        {...props}
      />
    )
  }
)

Toggle.displayName = 'Toggle'
