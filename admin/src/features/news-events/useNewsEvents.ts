import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createNewsEvent,
  deleteNewsEvent,
  getNewsEvent,
  getNewsEvents,
  publishNewsEvent,
  type GetNewsEventsParams,
  unpublishNewsEvent,
  updateNewsEvent,
} from '@/api/news-events.api'
import { ApiClientError } from '@/lib/api-client'

export function useNewsEvents(params: GetNewsEventsParams) {
  return useQuery({
    queryKey: ['news-events', params],
    queryFn: () => getNewsEvents(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useNewsEvent(id: string) {
  return useQuery({
    queryKey: ['news-events', id],
    queryFn: () => getNewsEvent(id),
    enabled: !!id,
  })
}

export function useCreateNewsEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewsEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-events'] })
      toast.success('Entry created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateNewsEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Parameters<typeof updateNewsEvent>[1] }) =>
      updateNewsEvent(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-events'] })
      toast.success('Entry updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function usePublishNewsEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => publishNewsEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-events'] })
      toast.success('Published successfully')
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 400) {
        toast.error('This entry is already published')
        return
      }
      toast.error(error.message)
    },
  })
}

export function useUnpublishNewsEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => unpublishNewsEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-events'] })
      toast.success('Unpublished successfully')
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 400) {
        toast.error('This entry is already unpublished')
        return
      }
      toast.error(error.message)
    },
  })
}

export function useDeleteNewsEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNewsEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-events'] })
      toast.success('Entry deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
