import { apiRequest } from '@/lib/api-client'
import type { DivisionCategory } from '@/types/services.types'

export const divisionCategoriesApi = {
  getDivisionCategories: () => apiRequest<DivisionCategory[]>('/division-categories'),

  createDivisionCategory: (dto: Omit<DivisionCategory, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<DivisionCategory>('/division-categories', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateDivisionCategory: (id: string, dto: Partial<Omit<DivisionCategory, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiRequest<DivisionCategory>(`/division-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteDivisionCategory: (id: string) =>
    apiRequest<{ message: string }>(`/division-categories/${id}`, {
      method: 'DELETE',
    }),
}
