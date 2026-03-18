import { apiRequest } from '@/lib/api-client';
import type { Division, ServiceCategory } from '@/types/services.types';

type ServiceCategoryListPayload = {
  data: ServiceCategory[];
  total: number;
};

type DivisionListPayload = {
  data: Division[];
  total: number;
};

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const result = await apiRequest<ServiceCategoryListPayload>(
    '/service-categories?perPage=100',
    { next: { revalidate: 3600, tags: ['service-categories'] } },
  );

  return result.data;
}

export async function getServiceCategory(id: string): Promise<ServiceCategory> {
  return apiRequest<ServiceCategory>(`/service-categories/${id}`, {
    next: {
      revalidate: 3600,
      tags: ['service-categories', `service-category-${id}`],
    },
  });
}

export async function getDivisions(params?: {
  serviceCategoryId?: string;
  divisionCategoryId?: string;
  isActive?: boolean;
  perPage?: number;
}): Promise<Division[]> {
  const query = new URLSearchParams();

  if (params?.serviceCategoryId) {
    query.set('serviceCategoryId', params.serviceCategoryId);
  }

  if (params?.divisionCategoryId) {
    query.set('divisionCategoryId', params.divisionCategoryId);
  }

  if (params?.isActive !== undefined) {
    query.set('isActive', String(params.isActive));
  }

  query.set('perPage', String(params?.perPage ?? 100));

  const result = await apiRequest<DivisionListPayload>(
    `/divisions?${query.toString()}`,
    { next: { revalidate: 3600, tags: ['divisions'] } },
  );

  return result.data;
}

export async function getDivision(id: string): Promise<Division> {
  return apiRequest<Division>(`/divisions/${id}`, {
    next: { revalidate: 3600, tags: ['divisions', `division-${id}`] },
  });
}

export async function getDivisionBySlug(slug: string): Promise<Division | null> {
  const result = await apiRequest<DivisionListPayload>('/divisions?perPage=100', {
    next: { revalidate: 3600, tags: ['divisions'] },
  });

  return result.data.find((division) => division.slug === slug) ?? null;
}
