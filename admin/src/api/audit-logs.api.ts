import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/user.types'
import type { AuditAction, AuditLog } from '@/types/audit-log.types'

type SortOrder = 'ASC' | 'DESC' | 'asc' | 'desc'

export type GetAuditLogsParams = {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
  startDate?: string
  endDate?: string
  action?: AuditAction
  entityType?: string
  performedBy?: string
  entityId?: string
}

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getAuditLogs(params: GetAuditLogsParams): Promise<PaginatedResponse<AuditLog>> {
  return apiRequest<PaginatedResponse<AuditLog>>(`/audit-logs${toQueryString(params)}`)
}
