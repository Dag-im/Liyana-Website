import { apiRequest } from '@/lib/api-client'
import type { Blog, BlogStatus } from '@/types/blogs.types'
import type { UploadedAsset } from '@/types/uploads.types'
import type { PaginatedResponse } from '@/types/user.types'

export type CreateBlogDto = {
  title: string
  excerpt: string
  content: string
  image: string
  categoryId: string
}

export type RejectBlogDto = {
  rejectionReason: string
}

export type GetBlogsParams = {
  page?: number
  perPage?: number
  search?: string
  status?: BlogStatus
  categoryId?: string
  authorId?: string
  featured?: boolean
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function uploadBlogFile(file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>('/blogs/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getBlogs(params: GetBlogsParams): Promise<PaginatedResponse<Blog>> {
  return apiRequest<PaginatedResponse<Blog>>(`/blogs${toQueryString(params)}`)
}

export function getBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}`)
}

export function createBlog(dto: CreateBlogDto): Promise<Blog> {
  return apiRequest<Blog>('/blogs', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateBlog(id: string, dto: Partial<CreateBlogDto>): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function submitBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/submit`, { method: 'PATCH' })
}

export function publishBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/publish`, { method: 'PATCH' })
}

export function rejectBlog(id: string, dto: RejectBlogDto): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function featureBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/feature`, { method: 'PATCH' })
}

export function unfeatureBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}/unfeature`, { method: 'PATCH' })
}

export function deleteBlog(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/blogs/${id}`, { method: 'DELETE' })
}
