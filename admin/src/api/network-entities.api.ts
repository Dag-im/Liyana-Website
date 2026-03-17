import { apiRequest } from '@/lib/api-client';
import type { NetworkEntity } from '@/types/corporate-network.types';
import type { PaginatedResponse } from '@/types/user.types';

export type GetNetworkEntitiesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  parentId?: string;
  relationId?: string;
};

export const networkEntitiesApi = {
  getNetworkEntities: (params: GetNetworkEntitiesParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    const query = searchParams.toString();
    return apiRequest<PaginatedResponse<NetworkEntity>>(
      `/network-entities${query ? `?${query}` : ''}`
    );
  },

  getNetworkTree: () => apiRequest<NetworkEntity[]>('/network-entities/tree'),

  getNetworkEntity: (id: string) =>
    apiRequest<NetworkEntity>(`/network-entities/${id}`),

  createNetworkEntity: (dto: {
    name: string;
    summary: string;
    description: string;
    insight: string;
    icon: string;
    sortOrder?: number;
    parentId?: string | null;
    relationId: string;
  }) =>
    apiRequest<NetworkEntity>('/network-entities', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateNetworkEntity: (
    id: string,
    dto: Partial<{
      name: string;
      summary: string;
      description: string;
      insight: string;
      icon: string;
      sortOrder: number;
      relationId: string;
    }>
  ) =>
    apiRequest<NetworkEntity>(`/network-entities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  moveNetworkEntity: (id: string, dto: { parentId: string | null }) =>
    apiRequest<NetworkEntity>(`/network-entities/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteNetworkEntity: (id: string) =>
    apiRequest<{ message: string }>(`/network-entities/${id}`, {
      method: 'DELETE',
    }),
};
