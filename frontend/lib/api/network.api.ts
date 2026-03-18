import { apiRequest } from '@/lib/api-client';
import type { NetworkEntity, NetworkMeta } from '@/types/network.types';

export async function getNetworkTree(): Promise<NetworkEntity[]> {
  return apiRequest<NetworkEntity[]>('/network-entities/tree', {
    next: { revalidate: 3600, tags: ['network'] },
  });
}

export async function getNetworkMeta(): Promise<NetworkMeta> {
  return apiRequest<NetworkMeta>('/network-meta', {
    next: { revalidate: 3600, tags: ['network'] },
  });
}
