import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getMediaFolders,
  getMediaFolder,
  createMediaFolder,
  updateMediaFolder,
  deleteMediaFolder,
  getMediaItems,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
} from '@/api/media.api'
import type { MediaItemType } from '@/types/media.types'

export function useMediaFolders(params: {
  page?: number
  perPage?: number
  search?: string
  tagId?: string
}) {
  return useQuery({
    queryKey: ['media-folders', params],
    queryFn: () => getMediaFolders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useMediaFolder(id: string) {
  return useQuery({
    queryKey: ['media-folders', id],
    queryFn: () => getMediaFolder(id),
    enabled: Boolean(id),
  })
}

export function useCreateMediaFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMediaFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-folders'] })
      toast.success('Media folder created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create media folder')
    },
  })
}

export function useUpdateMediaFolder(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: any) => updateMediaFolder(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-folders'] })
      toast.success('Media folder updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update media folder')
    },
  })
}

export function useDeleteMediaFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMediaFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-folders'] })
      toast.success('Media folder deleted')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete media folder')
    },
  })
}

export function useMediaItems(folderId: string, params: {
  page?: number
  perPage?: number
  search?: string
  type?: MediaItemType
}) {
  return useQuery({
    queryKey: ['media-items', folderId, params],
    queryFn: () => getMediaItems(folderId, params),
    enabled: Boolean(folderId),
  })
}

export function useCreateMediaItem(folderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: any) => createMediaItem(folderId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-items', folderId] })
      toast.success('Media item added')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add media item')
    },
  })
}

export function useUpdateMediaItem(folderId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: any) => updateMediaItem(folderId, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-items', folderId] })
      toast.success('Media item updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update media item')
    },
  })
}

export function useDeleteMediaItem(folderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMediaItem(folderId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-items', folderId] })
      toast.success('Media item deleted')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete media item')
    },
  })
}
