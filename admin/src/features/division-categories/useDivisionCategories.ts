import { divisionCategoriesApi } from '@/api/division-categories.api'
import type { DivisionCategory } from '@/types/services.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDivisionCategories() {
  return useQuery({
    queryKey: ['division-categories'],
    queryFn: divisionCategoriesApi.getDivisionCategories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateDivisionCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: Omit<DivisionCategory, 'id' | 'createdAt' | 'updatedAt'>) =>
      divisionCategoriesApi.createDivisionCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['division-categories'] })
      toast.success('Category created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

export function useUpdateDivisionCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<DivisionCategory, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      divisionCategoriesApi.updateDivisionCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['division-categories'] })
      toast.success('Category updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category')
    },
  })
}

export function useDeleteDivisionCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => divisionCategoriesApi.deleteDivisionCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['division-categories'] })
      toast.success('Category deleted')
    },
    onError: (error: any) => {
      if (error.status === 409) {
        toast.error('Cannot delete: divisions are assigned to this category')
      } else {
        toast.error(error.message || 'Failed to delete category')
      }
    },
  })
}
