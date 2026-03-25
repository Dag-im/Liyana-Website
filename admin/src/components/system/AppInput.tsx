import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type AppInputProps = ComponentProps<typeof Input>

export default function AppInput({ className, ...props }: AppInputProps) {
  return (
    <Input
      className={cn('h-10 rounded-xl', className)}
      {...props}
    />
  )
}
