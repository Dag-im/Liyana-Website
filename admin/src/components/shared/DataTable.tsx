import type { ReactNode } from 'react'
import { Fragment } from 'react'

import EmptyState from '@/components/shared/EmptyState'
import ErrorState from '@/components/shared/ErrorState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type Column<T> = {
  key: string
  header: string
  render?: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  expandedRowId?: string
  renderExpanded?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  getRowId?: (row: T, index: number) => string
}

export default function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading,
  isError,
  onRetry,
  expandedRowId,
  renderExpanded,
  onRowClick,
  getRowId,
}: DataTableProps<T>) {
  if (isError) {
    return <ErrorState onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => {
          const rowId = getRowId ? getRowId(row, rowIndex) : row.id ?? String(rowIndex)
          const isExpanded = expandedRowId !== undefined && expandedRowId === rowId

          return (
            <Fragment key={rowId}>
              <TableRow className={onRowClick ? 'cursor-pointer' : ''} onClick={() => onRowClick?.(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
              {isExpanded && renderExpanded ? (
                <TableRow>
                  <TableCell className="bg-muted/30" colSpan={columns.length}>
                    {renderExpanded(row)}
                  </TableCell>
                </TableRow>
              ) : null}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}
