import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { showErrorToast } from '@/lib/error-utils'

import {
  createBlog,
  deleteBlog,
  featureBlog,
  getBlog,
  getBlogs,
  publishBlog,
  rejectBlog,
  submitBlog,
  unfeatureBlog,
  updateBlog,
  type GetBlogsParams,
  type RejectBlogDto,
} from '@/api/blogs.api'

export function useBlogs(params: GetBlogsParams) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => getBlogs(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ['blogs', id],
    queryFn: () => getBlog(id),
    enabled: !!id,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog created successfully')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create blog'),
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Parameters<typeof updateBlog>[1] }) =>
      updateBlog(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog updated successfully')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update blog'),
  })
}

export function useSubmitBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => submitBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Submitted for review')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to submit blog'),
  })
}

export function usePublishBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => publishBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Published successfully')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to publish blog'),
  })
}

export function useRejectBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RejectBlogDto }) => rejectBlog(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog rejected')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to reject blog'),
  })
}

export function useFeatureBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => featureBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog featured')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to feature blog'),
  })
}

export function useUnfeatureBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => unfeatureBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog unfeatured')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to unfeature blog'),
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog deleted')
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete blog'),
  })
}
