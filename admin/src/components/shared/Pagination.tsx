import AppButton from '@/components/system/AppButton'

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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-500">
          Showing {start}-{end} of {total} results
        </p>
        {onPerPageChange && (
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Per page
            <select
              className="h-9 rounded-xl border border-border/80 bg-white px-3 text-xs text-slate-700 outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,155,217,0.2)]"
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
        <AppButton disabled={page <= 1} onClick={() => onPageChange(page - 1)} size="sm" variant="outline">
          Previous
        </AppButton>
        <span className="min-w-14 text-center text-xs font-medium text-slate-500">
          {page} / {maxPage}
        </span>
        <AppButton disabled={page >= maxPage} onClick={() => onPageChange(page + 1)} size="sm" variant="outline">
          Next
        </AppButton>
      </div>
    </div>
  )
}
