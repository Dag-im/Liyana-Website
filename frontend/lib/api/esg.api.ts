import { apiRequest } from '@/lib/api-client'
import { REVALIDATE } from '@/lib/revalidation'
import type {
  EsgGovernanceItem,
  EsgHero,
  EsgLucsBridge,
  EsgMetric,
  EsgPillar,
  EsgReport,
  EsgStrategy,
} from '@/types/esg.types'

export async function getEsgHero(): Promise<EsgHero | null> {
  return apiRequest<EsgHero | null>('/esg/hero', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'hero'] },
  })
}

export async function getEsgStrategy(): Promise<EsgStrategy | null> {
  return apiRequest<EsgStrategy | null>('/esg/strategy', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'strategy'] },
  })
}

export async function getEsgLucsBridge(): Promise<EsgLucsBridge | null> {
  return apiRequest<EsgLucsBridge | null>('/esg/lucs-bridge', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'lucs-bridge'] },
  })
}

export async function getEsgPillars(): Promise<EsgPillar[]> {
  return apiRequest<EsgPillar[]>('/esg/pillars', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'pillars'] },
  })
}

export async function getEsgMetrics(): Promise<EsgMetric[]> {
  return apiRequest<EsgMetric[]>('/esg/metrics', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'metrics'] },
  })
}

export async function getEsgGovernance(): Promise<EsgGovernanceItem[]> {
  return apiRequest<EsgGovernanceItem[]>('/esg/governance', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'governance'] },
  })
}

export async function getEsgReports(): Promise<EsgReport[]> {
  return apiRequest<EsgReport[]>('/esg/reports', {
    next: { revalidate: REVALIDATE.ESG, tags: ['esg', 'reports'] },
  })
}
