import { apiRequest } from '@/lib/api-client'
import type { MediaTag } from '@/types/media.types'

export function getMediaTags(): Promise<MediaTag[]> {
  return apiRequest<MediaTag[]>('/media-tags')
}

export function createMediaTag(dto: { name: string }): Promise<MediaTag> {
  return apiRequest<MediaTag>('/media-tags', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateMediaTag(id: string, dto: { name?: string }): Promise<MediaTag> {
  return apiRequest<MediaTag>(`/media-tags/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteMediaTag(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/media-tags/${id}`, {
    method: 'DELETE',
  })
}
