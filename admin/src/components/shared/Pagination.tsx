import { Button } from '@/components/ui/button'

type PaginationProps = {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, perPage, total, onPageChange }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)
  const maxPage = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)} variant="outline">
          Previous
        </Button>
        <Button disabled={page >= maxPage} onClick={() => onPageChange(page + 1)} variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}
