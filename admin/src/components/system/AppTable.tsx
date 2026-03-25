import type { ComponentProps } from 'react'

import { Table } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type AppTableProps = ComponentProps<typeof Table>

export default function AppTable({ className, ...props }: AppTableProps) {
  return (
    <Table
      className={cn('text-sm text-slate-700', className)}
      {...props}
    />
  )
}
