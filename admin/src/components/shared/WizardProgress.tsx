import { Check } from 'lucide-react'
import type { ComponentType } from 'react'

import { cn } from '@/lib/utils'

export type WizardStep = {
  id: number
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
}

type WizardProgressProps = {
  steps: WizardStep[]
  step: number
  className?: string
  onStepClick?: (step: number) => void
  isStepAccessible?: (step: number) => boolean
}

export default function WizardProgress({
  steps,
  step,
  className,
  onStepClick,
  isStepAccessible,
}: WizardProgressProps) {
  const progress = ((step - 1) / Math.max(steps.length - 1, 1)) * 100

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative mx-2 h-1 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((s) => {
          const Icon = s.icon
          const isActive = step === s.id
          const isComplete = step > s.id
          const canClick = !!onStepClick && (isStepAccessible ? isStepAccessible(s.id) : true)

          return (
            <button
              key={s.id}
              className={cn(
                'group flex items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors',
                isActive
                  ? 'border-primary/30 bg-primary/10'
                  : isComplete
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border/80 bg-background',
                canClick ? 'cursor-pointer hover:border-primary/30 hover:bg-accent/60' : 'cursor-default',
              )}
              disabled={!canClick}
              onClick={() => onStepClick?.(s.id)}
              type="button"
            >
              <div
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isComplete
                      ? 'border-primary/60 bg-primary/15 text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : Icon ? <Icon className="h-3.5 w-3.5" /> : s.id}
              </div>
              <div className="min-w-0">
                <p className={cn('truncate text-xs font-semibold', isActive ? 'text-primary' : 'text-foreground')}>
                  {s.title}
                </p>
                {s.description ? (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{s.description}</p>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
