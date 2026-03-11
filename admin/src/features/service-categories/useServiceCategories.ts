import { serviceCategoriesApi, type GetServiceCategoriesParams } from '@/api/service-categories.api'
import type { ServiceCategory } from '@/types/services.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useServiceCategories(params: GetServiceCategoriesParams) {
  return useQuery({
    queryKey: ['service-categories', params],
    queryFn: () => serviceCategoriesApi.getServiceCategories(params),
  })
}

export function useServiceCategory(id: string) {
  return useQuery({
    queryKey: ['service-categories', id],
    queryFn: () => serviceCategoriesApi.getServiceCategory(id),
    enabled: Boolean(id),
  })
}

export function useCreateServiceCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt' | 'divisions'>) =>
      serviceCategoriesApi.createServiceCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] })
    },
  })
}

export function useUpdateServiceCategory(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: Partial<Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt' | 'divisions'>>) =>
      serviceCategoriesApi.updateServiceCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories', id] })
      queryClient.invalidateQueries({ queryKey: ['service-categories'] })
    },
  })
}

export function useDeleteServiceCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => serviceCategoriesApi.deleteServiceCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] })
    },
  })
}
