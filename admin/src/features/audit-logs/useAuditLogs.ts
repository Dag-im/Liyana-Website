import { useQuery } from '@tanstack/react-query'

import { getAuditLogs, type GetAuditLogsParams } from '@/api/audit-logs.api'

export function useAuditLogs(params: GetAuditLogsParams) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => getAuditLogs(params),
    staleTime: 60_000,
  })
}
