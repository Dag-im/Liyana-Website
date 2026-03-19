import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type {
  CoreValue,
  MissionVision,
  QualityPolicy,
  Stat,
  WhoWeAre,
} from '@/types/cms.types';

export async function getMissionVision(): Promise<MissionVision> {
  return apiRequest<MissionVision>('/cms/mission-vision', {
    next: { revalidate: REVALIDATE.CMS, tags: ['cms', 'mission-vision'] },
  });
}

export async function getWhoWeAre(): Promise<WhoWeAre> {
  return apiRequest<WhoWeAre>('/cms/who-we-are', {
    next: { revalidate: REVALIDATE.CMS, tags: ['cms', 'who-we-are'] },
  });
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return apiRequest<CoreValue[]>('/cms/core-values', {
    next: { revalidate: REVALIDATE.CMS, tags: ['cms', 'core-values'] },
  });
}

export async function getStats(): Promise<Stat[]> {
  return apiRequest<Stat[]>('/cms/stats', {
    next: { revalidate: REVALIDATE.CMS, tags: ['cms', 'stats'] },
  });
}

export async function getQualityPolicy(): Promise<QualityPolicy[]> {
  return apiRequest<QualityPolicy[]>('/cms/quality-policy', {
    next: { revalidate: REVALIDATE.CMS, tags: ['cms', 'quality-policy'] },
  });
}
