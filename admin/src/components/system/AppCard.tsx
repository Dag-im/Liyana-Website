import type { ComponentProps } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AppCardProps = ComponentProps<typeof Card>

export default function AppCard({ className, ...props }: AppCardProps) {
  return (
    <Card
      className={cn('aura-surface rounded-xl', className)}
      {...props}
    />
  )
}
