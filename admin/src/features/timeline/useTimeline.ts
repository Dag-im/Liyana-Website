import {
  timelineApi,
  type CreateTimelineItemDto,
  type GetTimelineItemsParams,
  type UpdateTimelineItemDto,
} from '@/api/timeline.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showErrorToast } from '@/lib/error-utils'

export function useTimelineItems(params: GetTimelineItemsParams) {
  return useQuery({
    queryKey: ['timeline', params],
    queryFn: () => timelineApi.getTimelineItems(params),
  })
}

export function useTimelineItem(id: string) {
  return useQuery({
    queryKey: ['timeline', id],
    queryFn: () => timelineApi.getTimelineItem(id),
    enabled: Boolean(id),
  })
}

export function useCreateTimelineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateTimelineItemDto) => timelineApi.createTimelineItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Timeline entry created')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create timeline entry'),
  })
}

export function useUpdateTimelineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTimelineItemDto }) =>
      timelineApi.updateTimelineItem(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timeline', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Timeline entry updated')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update timeline entry'),
  })
}

export function useDeleteTimelineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => timelineApi.deleteTimelineItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Timeline entry deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete timeline entry'),
  })
}
