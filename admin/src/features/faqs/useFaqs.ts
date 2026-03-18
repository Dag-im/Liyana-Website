import {
  faqsApi,
  type CreateFaqCategoryDto,
  type CreateFaqDto,
  type GetFaqsParams,
  type UpdateFaqCategoryDto,
  type UpdateFaqDto,
} from '@/api/faqs.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useFaqCategories() {
  return useQuery({
    queryKey: ['faq-categories'],
    queryFn: () => faqsApi.getFaqCategories(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateFaqCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateFaqCategoryDto) => faqsApi.createFaqCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] })
      toast.success('FAQ category created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create FAQ category')
    },
  })
}

export function useUpdateFaqCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFaqCategoryDto }) =>
      faqsApi.updateFaqCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] })
      toast.success('FAQ category updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update FAQ category')
    },
  })
}

export function useDeleteFaqCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => faqsApi.deleteFaqCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] })
      toast.success('FAQ category deleted')
    },
    onError: (error: any) => {
      if (error?.status === 409) {
        toast.error('Cannot delete: FAQs are assigned to this category')
        return
      }
      toast.error(error.message || 'Failed to delete FAQ category')
    },
  })
}

export function useFaqs(params: GetFaqsParams) {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqsApi.getFaqs(params),
  })
}

export function useFaq(id: string) {
  return useQuery({
    queryKey: ['faqs', id],
    queryFn: () => faqsApi.getFaq(id),
    enabled: Boolean(id),
  })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateFaqDto) => faqsApi.createFaq(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      toast.success('FAQ created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create FAQ')
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFaqDto }) => faqsApi.updateFaq(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faqs', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      toast.success('FAQ updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update FAQ')
    },
  })
}

export function useReorderFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      faqsApi.reorderFaq(id, { position }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      toast.success('FAQ order updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reorder FAQ')
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => faqsApi.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      toast.success('FAQ deleted')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete FAQ')
    },
  })
}
