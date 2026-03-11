import { apiRequest } from '@/lib/api-client';
import type { Division, Doctor } from '@/types/services.types';
import type { PaginatedResponse } from '@/types/user.types';

export type GetDivisionsParams = {
  page?: number;
  perPage?: number;
  serviceCategoryId?: string;
  divisionCategoryId?: string;
  isActive?: boolean;
};

export const divisionsApi = {
  uploadDivisionFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ url: string }>('/divisions/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },

  getDivisions: (params: GetDivisionsParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    const query = searchParams.toString();
    return apiRequest<PaginatedResponse<Division>>(
      `/divisions${query ? `?${query}` : ''}`
    );
  },

  getDivision: (id: string) => apiRequest<Division>(`/divisions/${id}`),

  getDivisionDoctors: (id: string) =>
    apiRequest<Doctor[]>(`/divisions/${id}/doctors`),

  createDivision: (
    dto: any // Using any for complex nested DTO
  ) =>
    apiRequest<Division>('/divisions', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateDivision: (id: string, dto: any) =>
    apiRequest<Division>(`/divisions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteDivision: (id: string) =>
    apiRequest<{ message: string }>(`/divisions/${id}`, {
      method: 'DELETE',
    }),

  uploadDoctorFile: (divisionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ path: string }>(
      `/divisions/${divisionId}/doctors/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {},
      }
    );
  },

  createDoctor: (divisionId: string, dto: Omit<Doctor, 'id' | 'divisionId'>) =>
    apiRequest<Doctor>(`/divisions/${divisionId}/doctors`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateDoctor: (
    divisionId: string,
    id: string,
    dto: Partial<Omit<Doctor, 'id' | 'divisionId'>>
  ) =>
    apiRequest<Doctor>(`/divisions/${divisionId}/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteDoctor: (divisionId: string, id: string) =>
    apiRequest<{ message: string }>(`/divisions/${divisionId}/doctors/${id}`, {
      method: 'DELETE',
    }),
};
