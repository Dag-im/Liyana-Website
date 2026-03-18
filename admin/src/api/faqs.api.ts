import { apiRequest } from '@/lib/api-client'
import type { Faq, FaqCategory } from '@/types/faq.types'
import type { PaginatedResponse } from '@/types/user.types'

export type GetFaqsParams = {
  page?: number
  perPage?: number
  search?: string
  categoryId?: string
}

export type CreateFaqCategoryDto = {
  name: string
  sortOrder?: number
}

export type UpdateFaqCategoryDto = Partial<CreateFaqCategoryDto>

export type CreateFaqDto = {
  question: string
  answer: string
  position?: number
  categoryId: string
}

export type UpdateFaqDto = Partial<CreateFaqDto>

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const faqsApi = {
  getFaqCategories(): Promise<FaqCategory[]> {
    return apiRequest<FaqCategory[]>('/faq-categories')
  },

  createFaqCategory(dto: CreateFaqCategoryDto): Promise<FaqCategory> {
    return apiRequest<FaqCategory>('/faq-categories', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateFaqCategory(id: string, dto: UpdateFaqCategoryDto): Promise<FaqCategory> {
    return apiRequest<FaqCategory>(`/faq-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteFaqCategory(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/faq-categories/${id}`, {
      method: 'DELETE',
    })
  },

  getFaqs(params: GetFaqsParams): Promise<PaginatedResponse<Faq>> {
    return apiRequest<PaginatedResponse<Faq>>(`/faqs${buildQuery(params)}`)
  },

  getFaq(id: string): Promise<Faq> {
    return apiRequest<Faq>(`/faqs/${id}`)
  },

  createFaq(dto: CreateFaqDto): Promise<Faq> {
    return apiRequest<Faq>('/faqs', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  updateFaq(id: string, dto: UpdateFaqDto): Promise<Faq> {
    return apiRequest<Faq>(`/faqs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  reorderFaq(id: string, dto: { position: number }): Promise<Faq> {
    return apiRequest<Faq>(`/faqs/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    })
  },

  deleteFaq(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/faqs/${id}`, {
      method: 'DELETE',
    })
  },
}
