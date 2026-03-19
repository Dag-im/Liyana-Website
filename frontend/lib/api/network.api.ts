import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { NetworkEntity, NetworkMeta } from '@/types/network.types';

export async function getNetworkTree(): Promise<NetworkEntity[]> {
  return apiRequest<NetworkEntity[]>('/network-entities/tree', {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['network'] },
  });
}

export async function getNetworkMeta(): Promise<NetworkMeta> {
  return apiRequest<NetworkMeta>('/network-meta', {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['network'] },
  });
}
