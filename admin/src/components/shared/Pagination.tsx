import { Button } from '@/components/ui/button'

type PaginationProps = {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

export default function Pagination({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)
  const maxPage = Math.max(1, Math.ceil(total / perPage))
  const pageSizeOptions = [10, 20, 50, 100]

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {start}-{end} of {total} results
        </p>
        {onPerPageChange && (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Per page
            <select
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => {
                const value = Number(e.target.value)
                onPerPageChange(value)
                onPageChange(1)
              }}
              value={perPage}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)} size="sm" variant="outline">
          Previous
        </Button>
        <span className="min-w-14 text-center text-xs font-medium text-muted-foreground">
          {page} / {maxPage}
        </span>
        <Button disabled={page >= maxPage} onClick={() => onPageChange(page + 1)} size="sm" variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}
