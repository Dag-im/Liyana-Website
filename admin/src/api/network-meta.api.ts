import { apiRequest } from '@/lib/api-client';
import type { NetworkMeta } from '@/types/corporate-network.types';

export const networkMetaApi = {
  getNetworkMeta: () => apiRequest<NetworkMeta>('/network-meta'),
};
