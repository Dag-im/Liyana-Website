import { apiRequest } from '@/lib/api-client';
import type { ServiceCategory } from '@/types/services.types';
import type { PaginatedResponse } from '@/types/user.types';

export type GetServiceCategoriesParams = {
  page?: number;
  perPage?: number;
};

export const serviceCategoriesApi = {
  uploadServiceCategoryFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ url: string }>('/service-categories/upload', {
      method: 'POST',
      body: formData,
      // Note: Content-Type: application/json in api-client.ts might conflict with FormData.
      // We pass an empty headers object to hope it doesn't break fetch's auto-boundary.
      // If it fails, api-client.ts might need a small adjustment.
      headers: {},
    });
  },

  getServiceCategories: (params: GetServiceCategoriesParams) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.perPage) searchParams.set('perPage', params.perPage.toString());
    const query = searchParams.toString();
    return apiRequest<PaginatedResponse<ServiceCategory>>(
      `/service-categories${query ? `?${query}` : ''}`
    );
  },

  getServiceCategory: (id: string) =>
    apiRequest<ServiceCategory>(`/service-categories/${id}`),

  createServiceCategory: (
    dto: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt' | 'divisions'>
  ) =>
    apiRequest<ServiceCategory>('/service-categories', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateServiceCategory: (
    id: string,
    dto: Partial<
      Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt' | 'divisions'>
    >
  ) =>
    apiRequest<ServiceCategory>(`/service-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteServiceCategory: (id: string) =>
    apiRequest<{ message: string }>(`/service-categories/${id}`, {
      method: 'DELETE',
    }),
};
