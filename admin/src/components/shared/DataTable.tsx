import type { ReactNode } from 'react';
import { Fragment } from 'react';

import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';
import Pagination from '@/components/shared/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppTable from '@/components/system/AppTable';

type Column<T> = {
  header: string;
  accessorKey?: keyof T | string;
  id?: string;
  cell?: (props: { row: { original: T } }) => ReactNode;
  render?: (row: T) => ReactNode; // Legacy support
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  loading?: boolean; // Alias
  isError?: boolean;
  onRetry?: () => void;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
  };
  expandedRowId?: string;
  renderExpanded?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export default function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading,
  loading,
  isError,
  onRetry,
  pagination,
  expandedRowId,
  renderExpanded,
  onRowClick,
  getRowId,
  emptyTitle,
  emptyDescription,
  className,
}: DataTableProps<T>) {
  const activeLoading = isLoading || loading;

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (activeLoading) {
    return (
      <AppTable>
        <TableHeader>
          <TableRow>
            {columns.map((column, i) => (
              <TableHead key={column.id || column.accessorKey?.toString() || i}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column, i) => (
                  <TableCell
                    key={column.id || column.accessorKey?.toString() || i}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
      </AppTable>
    );
  }

  if (data.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="max-h-140 overflow-auto">
          <AppTable className={className}>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {columns.map((column, i) => (
                  <TableHead
                    className="h-11 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                    key={column.id || column.accessorKey?.toString() || i}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => {
                const rowId = getRowId
                  ? getRowId(row, rowIndex)
                  : (row.id ?? String(rowIndex));
                const isExpanded =
                  expandedRowId !== undefined && expandedRowId === rowId;

                return (
                  <Fragment key={rowId}>
                    <TableRow
                      className={
                        onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
                      }
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column, i) => (
                        <TableCell
                          className="py-3.5"
                          key={column.id || column.accessorKey?.toString() || i}
                        >
                          {column.cell
                            ? column.cell({ row: { original: row } })
                            : column.render
                              ? column.render(row)
                              : String(
                                  (row as Record<string, unknown>)[
                                    String(column.accessorKey)
                                  ] ?? ''
                                )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded && renderExpanded ? (
                      <TableRow>
                        <TableCell
                          className="bg-slate-50 py-4"
                          colSpan={columns.length}
                        >
                          {renderExpanded(row)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </AppTable>
        </div>
      </div>
      {pagination && (
        <Pagination
          page={pagination.page}
          perPage={pagination.perPage}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPerPageChange={pagination.onPerPageChange}
        />
      )}
    </div>
  );
}
