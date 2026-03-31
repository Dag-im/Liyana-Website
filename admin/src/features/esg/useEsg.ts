import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/esg.api'
import { getErrorMessage } from '@/lib/error-utils'

const onMutationError = (error: unknown) => {
  toast.error(getErrorMessage(error))
}

function useInvalidateOnSuccess(message: string, queryKey: unknown[]) {
  const queryClient = useQueryClient()

  return {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(message)
    },
    onError: onMutationError,
  } as const
}

export function useEsgHero() {
  return useQuery({
    queryKey: ['esg', 'hero'],
    queryFn: api.getEsgHero,
  })
}

export function useUpdateEsgHero() {
  return useMutation({
    mutationFn: api.updateEsgHero,
    ...useInvalidateOnSuccess('ESG hero updated', ['esg']),
  })
}

export function usePublishEsgHero() {
  return useMutation({
    mutationFn: api.publishEsgHero,
    ...useInvalidateOnSuccess('ESG hero published', ['esg']),
  })
}

export function useUnpublishEsgHero() {
  return useMutation({
    mutationFn: api.unpublishEsgHero,
    ...useInvalidateOnSuccess('ESG hero unpublished', ['esg']),
  })
}

export function useEsgStrategy() {
  return useQuery({
    queryKey: ['esg', 'strategy'],
    queryFn: api.getEsgStrategy,
  })
}

export function useUpdateEsgStrategy() {
  return useMutation({
    mutationFn: api.updateEsgStrategy,
    ...useInvalidateOnSuccess('ESG strategy updated', ['esg']),
  })
}

export function usePublishEsgStrategy() {
  return useMutation({
    mutationFn: api.publishEsgStrategy,
    ...useInvalidateOnSuccess('ESG strategy published', ['esg']),
  })
}

export function useUnpublishEsgStrategy() {
  return useMutation({
    mutationFn: api.unpublishEsgStrategy,
    ...useInvalidateOnSuccess('ESG strategy unpublished', ['esg']),
  })
}

export function useEsgLucsBridge() {
  return useQuery({
    queryKey: ['esg', 'lucs-bridge'],
    queryFn: api.getEsgLucsBridge,
  })
}

export function useUpdateEsgLucsBridge() {
  return useMutation({
    mutationFn: api.updateEsgLucsBridge,
    ...useInvalidateOnSuccess('LUCS bridge updated', ['esg']),
  })
}

export function usePublishEsgLucsBridge() {
  return useMutation({
    mutationFn: api.publishEsgLucsBridge,
    ...useInvalidateOnSuccess('LUCS bridge published', ['esg']),
  })
}

export function useUnpublishEsgLucsBridge() {
  return useMutation({
    mutationFn: api.unpublishEsgLucsBridge,
    ...useInvalidateOnSuccess('LUCS bridge unpublished', ['esg']),
  })
}

export function useEsgPillars() {
  return useQuery({
    queryKey: ['esg', 'pillars'],
    queryFn: api.getEsgPillars,
  })
}

export function useCreateEsgPillar() {
  return useMutation({
    mutationFn: api.createEsgPillar,
    ...useInvalidateOnSuccess('ESG pillar created', ['esg', 'pillars']),
  })
}

export function useUpdateEsgPillar() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateEsgPillarDto }) =>
      api.updateEsgPillar(id, dto),
    ...useInvalidateOnSuccess('ESG pillar updated', ['esg', 'pillars']),
  })
}

export function usePublishEsgPillar() {
  return useMutation({
    mutationFn: api.publishEsgPillar,
    ...useInvalidateOnSuccess('ESG pillar published', ['esg', 'pillars']),
  })
}

export function useUnpublishEsgPillar() {
  return useMutation({
    mutationFn: api.unpublishEsgPillar,
    ...useInvalidateOnSuccess('ESG pillar unpublished', ['esg', 'pillars']),
  })
}

export function useDeleteEsgPillar() {
  return useMutation({
    mutationFn: api.deleteEsgPillar,
    ...useInvalidateOnSuccess('ESG pillar deleted', ['esg', 'pillars']),
  })
}

export function useEsgMetrics() {
  return useQuery({
    queryKey: ['esg', 'metrics'],
    queryFn: api.getEsgMetrics,
  })
}

export function useCreateEsgMetric() {
  return useMutation({
    mutationFn: api.createEsgMetric,
    ...useInvalidateOnSuccess('ESG metric created', ['esg', 'metrics']),
  })
}

export function useUpdateEsgMetric() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateEsgMetricDto }) =>
      api.updateEsgMetric(id, dto),
    ...useInvalidateOnSuccess('ESG metric updated', ['esg', 'metrics']),
  })
}

export function usePublishEsgMetric() {
  return useMutation({
    mutationFn: api.publishEsgMetric,
    ...useInvalidateOnSuccess('ESG metric published', ['esg', 'metrics']),
  })
}

export function useUnpublishEsgMetric() {
  return useMutation({
    mutationFn: api.unpublishEsgMetric,
    ...useInvalidateOnSuccess('ESG metric unpublished', ['esg', 'metrics']),
  })
}

export function useDeleteEsgMetric() {
  return useMutation({
    mutationFn: api.deleteEsgMetric,
    ...useInvalidateOnSuccess('ESG metric deleted', ['esg', 'metrics']),
  })
}

export function useEsgGovernance() {
  return useQuery({
    queryKey: ['esg', 'governance'],
    queryFn: api.getEsgGovernance,
  })
}

export function useCreateEsgGovernanceItem() {
  return useMutation({
    mutationFn: api.createEsgGovernanceItem,
    ...useInvalidateOnSuccess('Governance item created', ['esg', 'governance']),
  })
}

export function useUpdateEsgGovernanceItem() {
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: api.UpdateEsgGovernanceItemDto
    }) => api.updateEsgGovernanceItem(id, dto),
    ...useInvalidateOnSuccess('Governance item updated', ['esg', 'governance']),
  })
}

export function usePublishEsgGovernanceItem() {
  return useMutation({
    mutationFn: api.publishEsgGovernanceItem,
    ...useInvalidateOnSuccess('Governance item published', ['esg', 'governance']),
  })
}

export function useUnpublishEsgGovernanceItem() {
  return useMutation({
    mutationFn: api.unpublishEsgGovernanceItem,
    ...useInvalidateOnSuccess('Governance item unpublished', ['esg', 'governance']),
  })
}

export function useDeleteEsgGovernanceItem() {
  return useMutation({
    mutationFn: api.deleteEsgGovernanceItem,
    ...useInvalidateOnSuccess('Governance item deleted', ['esg', 'governance']),
  })
}

export function useEsgReports() {
  return useQuery({
    queryKey: ['esg', 'reports'],
    queryFn: api.getEsgReports,
  })
}

export function useCreateEsgReport() {
  return useMutation({
    mutationFn: api.createEsgReport,
    ...useInvalidateOnSuccess('ESG report created', ['esg', 'reports']),
  })
}

export function useUpdateEsgReport() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateEsgReportDto }) =>
      api.updateEsgReport(id, dto),
    ...useInvalidateOnSuccess('ESG report updated', ['esg', 'reports']),
  })
}

export function usePublishEsgReport() {
  return useMutation({
    mutationFn: api.publishEsgReport,
    ...useInvalidateOnSuccess('ESG report published', ['esg', 'reports']),
  })
}

export function useUnpublishEsgReport() {
  return useMutation({
    mutationFn: api.unpublishEsgReport,
    ...useInvalidateOnSuccess('ESG report unpublished', ['esg', 'reports']),
  })
}

export function useDeleteEsgReport() {
  return useMutation({
    mutationFn: api.deleteEsgReport,
    ...useInvalidateOnSuccess('ESG report deleted', ['esg', 'reports']),
  })
}
