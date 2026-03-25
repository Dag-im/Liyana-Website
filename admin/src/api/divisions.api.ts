import { apiRequest } from '@/lib/api-client';
import type { Division, Doctor } from '@/types/services.types';
import type { UploadedAsset } from '@/types/uploads.types';
import type { PaginatedResponse } from '@/types/user.types';

export type GetDivisionsParams = {
  page?: number;
  perPage?: number;
  serviceCategoryId?: string;
  divisionCategoryId?: string;
  isActive?: boolean;
};

export type UpdateMyDivisionDto = Partial<{
  name: string;
  shortName: string;
  location: string;
  overview: string;
  description: string;
  logo: string;
  groupPhoto: string;
  images: Array<{ path: string; alt?: string }>;
  coreServices: Array<{ name: string; description?: string }>;
  stats: Array<{ label: string; value: string; sortOrder?: number }>;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
    googleMap?: string;
  };
}>;

export const divisionsApi = {
  uploadDivisionFile: async (file: File): Promise<UploadedAsset> => {
    const formData = new FormData();
    formData.append('files', file); // Backend expects 'files' array for divisions
    const results = await apiRequest<UploadedAsset[]>('/divisions/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    return results[0];
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
  getMyDivision: (divisionId: string) => apiRequest<Division>(`/divisions/${divisionId}`),

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

  updateMyDivision: (divisionId: string, dto: UpdateMyDivisionDto) =>
    apiRequest<Division>(`/divisions/${divisionId}`, {
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
    return apiRequest<UploadedAsset>(
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
