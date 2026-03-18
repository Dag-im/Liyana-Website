import { apiRequest } from '@/lib/api-client';
import type {
  CoreValue,
  MissionVision,
  QualityPolicy,
  Stat,
  WhoWeAre,
} from '@/types/cms.types';

export async function getMissionVision(): Promise<MissionVision> {
  return apiRequest<MissionVision>('/cms/mission-vision', {
    next: { revalidate: 86400, tags: ['cms', 'mission-vision'] },
  });
}

export async function getWhoWeAre(): Promise<WhoWeAre> {
  return apiRequest<WhoWeAre>('/cms/who-we-are', {
    next: { revalidate: 86400, tags: ['cms', 'who-we-are'] },
  });
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return apiRequest<CoreValue[]>('/cms/core-values', {
    next: { revalidate: 86400, tags: ['cms', 'core-values'] },
  });
}

export async function getStats(): Promise<Stat[]> {
  return apiRequest<Stat[]>('/cms/stats', {
    next: { revalidate: 86400, tags: ['cms', 'stats'] },
  });
}

export async function getQualityPolicy(): Promise<QualityPolicy[]> {
  return apiRequest<QualityPolicy[]>('/cms/quality-policy', {
    next: { revalidate: 86400, tags: ['cms', 'quality-policy'] },
  });
}
