import { apiRequest } from '@/lib/api-client'
import type { BlogCategory } from '@/types/blogs.types'

export function getBlogCategories(): Promise<BlogCategory[]> {
  return apiRequest<BlogCategory[]>('/blog-categories')
}

export function createBlogCategory(dto: { name: string }): Promise<BlogCategory> {
  return apiRequest<BlogCategory>('/blog-categories', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateBlogCategory(id: string, dto: { name: string }): Promise<BlogCategory> {
  return apiRequest<BlogCategory>(`/blog-categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteBlogCategory(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/blog-categories/${id}`, {
    method: 'DELETE',
  })
}
