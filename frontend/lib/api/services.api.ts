import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { Division, ServiceCategory } from '@/types/services.types';

type ServiceCategoryListPayload = {
  data: ServiceCategory[];
  total: number;
  page: number;
  perPage: number;
};

type DivisionListPayload = {
  data: Division[];
  total: number;
  page: number;
  perPage: number;
};

const MAX_PER_PAGE = 100;

async function fetchAllServiceCategories(): Promise<ServiceCategory[]> {
  const firstPage = await apiRequest<ServiceCategoryListPayload>(
    `/service-categories?page=1&perPage=${MAX_PER_PAGE}`,
    { next: { revalidate: REVALIDATE.SERVICES, tags: ['service-categories'] } },
  );

  const totalPages = Math.max(1, Math.ceil(firstPage.total / MAX_PER_PAGE));
  if (totalPages === 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      apiRequest<ServiceCategoryListPayload>(
        `/service-categories?page=${index + 2}&perPage=${MAX_PER_PAGE}`,
        {
          next: { revalidate: REVALIDATE.SERVICES, tags: ['service-categories'] },
        },
      ),
    ),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((pagePayload) => pagePayload.data),
  ].sort(
    (a, b) =>
      (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
      a.title.localeCompare(b.title),
  );
}

async function fetchAllDivisions(params?: {
  serviceCategoryId?: string;
  divisionCategoryId?: string;
  isActive?: boolean;
}): Promise<Division[]> {
  const firstQuery = new URLSearchParams();
  firstQuery.set('page', '1');
  firstQuery.set('perPage', String(MAX_PER_PAGE));

  if (params?.serviceCategoryId) {
    firstQuery.set('serviceCategoryId', params.serviceCategoryId);
  }
  if (params?.divisionCategoryId) {
    firstQuery.set('divisionCategoryId', params.divisionCategoryId);
  }
  if (params?.isActive !== undefined) {
    firstQuery.set('isActive', String(params.isActive));
  }

  const firstPage = await apiRequest<DivisionListPayload>(
    `/divisions?${firstQuery.toString()}`,
    { next: { revalidate: REVALIDATE.SERVICES, tags: ['divisions'] } },
  );

  const totalPages = Math.max(1, Math.ceil(firstPage.total / MAX_PER_PAGE));
  if (totalPages === 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => {
      const query = new URLSearchParams(firstQuery);
      query.set('page', String(index + 2));
      return apiRequest<DivisionListPayload>(`/divisions?${query.toString()}`, {
        next: { revalidate: REVALIDATE.SERVICES, tags: ['divisions'] },
      });
    }),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((pagePayload) => pagePayload.data),
  ];
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const categories = await fetchAllServiceCategories();
  const divisionResults = await Promise.allSettled(
    categories.map((category) =>
      apiRequest<Division[]>(`/service-categories/${category.id}/divisions`, {
        next: {
          revalidate: REVALIDATE.SERVICES,
          tags: ['service-categories', `service-category-${category.id}`, 'divisions'],
        },
      }),
    ),
  );

  return categories.map((category, index) => ({
    ...category,
    divisions:
      divisionResults[index]?.status === 'fulfilled'
        ? divisionResults[index].value
        : [],
  }));
}

export async function getServiceCategory(id: string): Promise<ServiceCategory> {
  return apiRequest<ServiceCategory>(`/service-categories/${id}`, {
    next: {
      revalidate: REVALIDATE.SERVICES,
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
  if (!params?.perPage || params.perPage > MAX_PER_PAGE) {
    return fetchAllDivisions({
      serviceCategoryId: params?.serviceCategoryId,
      divisionCategoryId: params?.divisionCategoryId,
      isActive: params?.isActive,
    });
  }

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

  query.set('perPage', String(params.perPage));

  const result = await apiRequest<DivisionListPayload>(
    `/divisions?${query.toString()}`,
    { next: { revalidate: REVALIDATE.SERVICES, tags: ['divisions'] } },
  );

  return result.data;
}

export async function getDivision(id: string): Promise<Division> {
  return apiRequest<Division>(`/divisions/${id}`, {
    next: {
      revalidate: REVALIDATE.SERVICES,
      tags: ['divisions', `division-${id}`],
    },
  });
}

export async function getDivisionBySlug(slug: string): Promise<Division | null> {
  const divisions = await fetchAllDivisions();
  const division = divisions.find((item) => item.slug === slug);
  if (!division) {
    return null;
  }

  return getDivision(division.id);
}
