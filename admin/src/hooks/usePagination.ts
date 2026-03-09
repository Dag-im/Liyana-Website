import { useState } from 'react'

import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export function usePagination(initialPage = 1, initialPerPage = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage)
  const [perPage, setPerPage] = useState(initialPerPage)

  const resetPage = () => setPage(1)

  return {
    page,
    perPage,
    setPage,
    setPerPage,
    resetPage,
  }
}
