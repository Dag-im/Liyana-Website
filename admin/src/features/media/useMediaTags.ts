import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMediaTags,
  createMediaTag,
  updateMediaTag,
  deleteMediaTag,
} from '@/api/media-tags.api'

export function useMediaTags() {
  return useQuery({
    queryKey: ['media-tags'],
    queryFn: getMediaTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateMediaTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMediaTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-tags'] })
      toast.success('Media tag created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create media tag')
    },
  })
}

export function useUpdateMediaTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) =>
      updateMediaTag(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-tags'] })
      toast.success('Media tag updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update media tag')
    },
  })
}

export function useDeleteMediaTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMediaTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-tags'] })
      toast.success('Media tag deleted')
    },
    onError: (error: any) => {
      if (error.status === 409) {
        toast.error('Cannot delete: folders are assigned to this tag')
      } else {
        toast.error(error.message || 'Failed to delete media tag')
      }
    },
  })
}
