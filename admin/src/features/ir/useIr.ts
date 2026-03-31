import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/ir.api'
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

export function useIrHero() {
  return useQuery({
    queryKey: ['ir', 'hero'],
    queryFn: api.getIrHero,
  })
}

export function useUpdateIrHero() {
  return useMutation({
    mutationFn: api.updateIrHero,
    ...useInvalidateOnSuccess('IR hero updated', ['ir']),
  })
}

export function usePublishIrHero() {
  return useMutation({
    mutationFn: api.publishIrHero,
    ...useInvalidateOnSuccess('IR hero published', ['ir']),
  })
}

export function useUnpublishIrHero() {
  return useMutation({
    mutationFn: api.unpublishIrHero,
    ...useInvalidateOnSuccess('IR hero unpublished', ['ir']),
  })
}

export function useIrStrategy() {
  return useQuery({
    queryKey: ['ir', 'strategy'],
    queryFn: api.getIrStrategy,
  })
}

export function useUpdateIrStrategy() {
  return useMutation({
    mutationFn: api.updateIrStrategy,
    ...useInvalidateOnSuccess('IR strategy updated', ['ir']),
  })
}

export function usePublishIrStrategy() {
  return useMutation({
    mutationFn: api.publishIrStrategy,
    ...useInvalidateOnSuccess('IR strategy published', ['ir']),
  })
}

export function useUnpublishIrStrategy() {
  return useMutation({
    mutationFn: api.unpublishIrStrategy,
    ...useInvalidateOnSuccess('IR strategy unpublished', ['ir']),
  })
}

export function useIrContact() {
  return useQuery({
    queryKey: ['ir', 'contact'],
    queryFn: api.getIrContact,
  })
}

export function useUpdateIrContact() {
  return useMutation({
    mutationFn: api.updateIrContact,
    ...useInvalidateOnSuccess('IR contact updated', ['ir']),
  })
}

export function usePublishIrContact() {
  return useMutation({
    mutationFn: api.publishIrContact,
    ...useInvalidateOnSuccess('IR contact published', ['ir']),
  })
}

export function useUnpublishIrContact() {
  return useMutation({
    mutationFn: api.unpublishIrContact,
    ...useInvalidateOnSuccess('IR contact unpublished', ['ir']),
  })
}

export function useIrKpis() {
  return useQuery({
    queryKey: ['ir', 'kpis'],
    queryFn: api.getIrKpis,
  })
}

export function useCreateIrKpi() {
  return useMutation({
    mutationFn: api.createIrKpi,
    ...useInvalidateOnSuccess('IR KPI created', ['ir', 'kpis']),
  })
}

export function useUpdateIrKpi() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateIrKpiDto }) =>
      api.updateIrKpi(id, dto),
    ...useInvalidateOnSuccess('IR KPI updated', ['ir', 'kpis']),
  })
}

export function usePublishIrKpi() {
  return useMutation({
    mutationFn: api.publishIrKpi,
    ...useInvalidateOnSuccess('IR KPI published', ['ir', 'kpis']),
  })
}

export function useUnpublishIrKpi() {
  return useMutation({
    mutationFn: api.unpublishIrKpi,
    ...useInvalidateOnSuccess('IR KPI unpublished', ['ir', 'kpis']),
  })
}

export function useDeleteIrKpi() {
  return useMutation({
    mutationFn: api.deleteIrKpi,
    ...useInvalidateOnSuccess('IR KPI deleted', ['ir', 'kpis']),
  })
}

export function useIrFinancialColumns() {
  return useQuery({
    queryKey: ['ir', 'financial-columns'],
    queryFn: api.getIrFinancialColumns,
  })
}

export function useCreateIrFinancialColumn() {
  return useMutation({
    mutationFn: api.createIrFinancialColumn,
    ...useInvalidateOnSuccess('Financial column created', ['ir', 'financial-columns']),
  })
}

export function useUpdateIrFinancialColumn() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateIrFinancialColumnDto }) =>
      api.updateIrFinancialColumn(id, dto),
    ...useInvalidateOnSuccess('Financial column updated', ['ir', 'financial-columns']),
  })
}

export function useDeleteIrFinancialColumn() {
  return useMutation({
    mutationFn: api.deleteIrFinancialColumn,
    ...useInvalidateOnSuccess('Financial column deleted', ['ir', 'financial-columns']),
  })
}

export function useIrFinancialRows() {
  return useQuery({
    queryKey: ['ir', 'financial-rows'],
    queryFn: api.getIrFinancialRows,
  })
}

export function useCreateIrFinancialRow() {
  return useMutation({
    mutationFn: api.createIrFinancialRow,
    ...useInvalidateOnSuccess('Financial row created', ['ir', 'financial-rows']),
  })
}

export function useUpdateIrFinancialRow() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateIrFinancialRowDto }) =>
      api.updateIrFinancialRow(id, dto),
    ...useInvalidateOnSuccess('Financial row updated', ['ir', 'financial-rows']),
  })
}

export function usePublishIrFinancialRow() {
  return useMutation({
    mutationFn: api.publishIrFinancialRow,
    ...useInvalidateOnSuccess('Financial row published', ['ir', 'financial-rows']),
  })
}

export function useUnpublishIrFinancialRow() {
  return useMutation({
    mutationFn: api.unpublishIrFinancialRow,
    ...useInvalidateOnSuccess('Financial row unpublished', ['ir', 'financial-rows']),
  })
}

export function useDeleteIrFinancialRow() {
  return useMutation({
    mutationFn: api.deleteIrFinancialRow,
    ...useInvalidateOnSuccess('Financial row deleted', ['ir', 'financial-rows']),
  })
}

export function useIrDocuments() {
  return useQuery({
    queryKey: ['ir', 'documents'],
    queryFn: api.getIrDocuments,
  })
}

export function useCreateIrDocument() {
  return useMutation({
    mutationFn: api.createIrDocument,
    ...useInvalidateOnSuccess('IR document created', ['ir', 'documents']),
  })
}

export function useUpdateIrDocument() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: api.UpdateIrDocumentDto }) =>
      api.updateIrDocument(id, dto),
    ...useInvalidateOnSuccess('IR document updated', ['ir', 'documents']),
  })
}

export function usePublishIrDocument() {
  return useMutation({
    mutationFn: api.publishIrDocument,
    ...useInvalidateOnSuccess('IR document published', ['ir', 'documents']),
  })
}

export function useUnpublishIrDocument() {
  return useMutation({
    mutationFn: api.unpublishIrDocument,
    ...useInvalidateOnSuccess('IR document unpublished', ['ir', 'documents']),
  })
}

export function useDeleteIrDocument() {
  return useMutation({
    mutationFn: api.deleteIrDocument,
    ...useInvalidateOnSuccess('IR document deleted', ['ir', 'documents']),
  })
}

export function useIrInquiries(params: api.GetIrInquiriesParams) {
  return useQuery({
    queryKey: ['ir', 'inquiries', params],
    queryFn: () => api.getIrInquiries(params),
  })
}

export function useIrInquiry(id: string) {
  return useQuery({
    queryKey: ['ir', 'inquiries', id],
    queryFn: () => api.getIrInquiry(id),
    enabled: !!id,
  })
}

export function useReviewIrInquiry() {
  return useMutation({
    mutationFn: api.reviewIrInquiry,
    ...useInvalidateOnSuccess('Inquiry marked reviewed', ['ir', 'inquiries']),
  })
}

export function useDeleteIrInquiry() {
  return useMutation({
    mutationFn: api.deleteIrInquiry,
    ...useInvalidateOnSuccess('Inquiry deleted', ['ir', 'inquiries']),
  })
}
