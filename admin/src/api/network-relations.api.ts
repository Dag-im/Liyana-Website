import { apiRequest } from '@/lib/api-client';
import type { NetworkRelation } from '@/types/corporate-network.types';

export const networkRelationsApi = {
  getNetworkRelations: () => apiRequest<NetworkRelation[]>('/network-relations'),

  createNetworkRelation: (dto: {
    name: string;
    label: string;
    description?: string;
    sortOrder?: number;
  }) =>
    apiRequest<NetworkRelation>('/network-relations', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  updateNetworkRelation: (id: string, dto: Partial<{
    name: string;
    label: string;
    description: string | null;
    sortOrder: number;
  }>) =>
    apiRequest<NetworkRelation>(`/network-relations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  deleteNetworkRelation: (id: string) =>
    apiRequest<{ message: string }>(`/network-relations/${id}`, {
      method: 'DELETE',
    }),
};
