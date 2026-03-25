import { apiRequest } from '@/lib/api-client'
import type { MediaFolder, MediaItem, MediaItemType } from '@/types/media.types'
import type { UploadedAsset } from '@/types/uploads.types'
import type { PaginatedResponse } from '@/types/user.types'

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function uploadFolderCover(file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>('/media-folders/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getMediaFolders(params: {
  page?: number
  perPage?: number
  search?: string
  tagId?: string
}): Promise<PaginatedResponse<MediaFolder>> {
  return apiRequest<PaginatedResponse<MediaFolder>>(`/media-folders${toQueryString(params)}`)
}

export function getMediaFolder(id: string): Promise<MediaFolder> {
  return apiRequest<MediaFolder>(`/media-folders/${id}`)
}

export function createMediaFolder(dto: {
  name: string
  coverImage: string
  description: string
  sortOrder?: number
  tagId: string
}): Promise<MediaFolder> {
  return apiRequest<MediaFolder>('/media-folders', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateMediaFolder(id: string, dto: Partial<{
  name: string
  coverImage: string
  description: string
  sortOrder: number
  tagId: string
}>): Promise<MediaFolder> {
  return apiRequest<MediaFolder>(`/media-folders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteMediaFolder(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/media-folders/${id}`, {
    method: 'DELETE',
  })
}

export function uploadMediaItem(folderId: string, file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>(`/media-folders/${folderId}/items/upload`, {
    method: 'POST',
    body: formData,
  })
}

export function getMediaItems(folderId: string, params: {
  page?: number
  perPage?: number
  search?: string
  type?: MediaItemType
}): Promise<PaginatedResponse<MediaItem>> {
  return apiRequest<PaginatedResponse<MediaItem>>(`/media-folders/${folderId}/items${toQueryString(params)}`)
}

export function createMediaItem(folderId: string, dto: {
  title: string
  url: string
  thumbnail?: string
  sortOrder?: number
}): Promise<MediaItem> {
  return apiRequest<MediaItem>(`/media-folders/${folderId}/items`, {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateMediaItem(folderId: string, id: string, dto: Partial<{
  title: string
  url: string
  thumbnail: string
  sortOrder: number
}>): Promise<MediaItem> {
  return apiRequest<MediaItem>(`/media-folders/${folderId}/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteMediaItem(folderId: string, id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/media-folders/${folderId}/items/${id}`, {
    method: 'DELETE',
  })
}
