import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StatusTone =
  | 'emerald'
  | 'amber'
  | 'slate'
  | 'red'
  | 'blue'
  | 'purple'

type StatusPillProps = {
  label: string
  tone?: StatusTone
  icon?: ReactNode
  className?: string
}

const toneStyles: Record<StatusTone, { wrapper: string; dot: string }> = {
  emerald: {
    wrapper: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    dot: 'bg-emerald-500',
  },
  amber: {
    wrapper: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    dot: 'bg-amber-500',
  },
  slate: {
    wrapper: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    dot: 'bg-slate-500',
  },
  red: {
    wrapper: 'bg-red-50 text-red-700 ring-1 ring-red-100',
    dot: 'bg-red-500',
  },
  blue: {
    wrapper: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
    dot: 'bg-sky-500',
  },
  purple: {
    wrapper: 'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
    dot: 'bg-purple-500',
  },
}

export default function StatusPill({
  label,
  tone = 'slate',
  icon,
  className,
}: StatusPillProps) {
  const styles = toneStyles[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
        styles.wrapper,
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full animate-pulse', styles.dot)} />
      {icon}
      {label}
    </span>
  )
}
