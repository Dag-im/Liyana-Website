import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AppButtonProps = ComponentProps<typeof Button>

export default function AppButton({ className, ...props }: AppButtonProps) {
  return (
    <Button
      className={cn('h-10 rounded-xl', className)}
      {...props}
    />
  )
}
