import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showErrorToast } from '@/lib/error-utils'

import {
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategories,
  updateBlogCategory,
} from '@/api/blog-categories.api'

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: getBlogCategories,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createBlogCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Category created')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create category'),
  })
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateBlogCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Category updated')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update category'),
  })
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlogCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
      toast.success('Category deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete category'),
  })
}
