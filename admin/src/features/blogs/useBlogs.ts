import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
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
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
