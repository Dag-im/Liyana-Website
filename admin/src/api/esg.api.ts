import { apiRequest } from '@/lib/api-client'
import type {
  EsgGovernanceItem,
  EsgHero,
  EsgLucsBridge,
  EsgMetric,
  EsgPillar,
  EsgReport,
  EsgStrategy,
} from '@/types/esg.types'
import type { UploadedAsset } from '@/types/uploads.types'

export type UpsertEsgHeroDto = {
  tagline?: string
  subtitle?: string
  backgroundImage?: string
}

export type UpsertEsgStrategyDto = {
  content?: string
}

export type UpsertEsgLucsBridgeDto = {
  title?: string
  description?: string
  buttonText?: string
}

export type CreateEsgPillarDto = {
  title: string
  description: string
  icon: string
  sortOrder?: number
  document?: string
  initiatives: string[]
}

export type UpdateEsgPillarDto = Partial<CreateEsgPillarDto>

export type CreateEsgMetricDto = {
  label: string
  value: string
  suffix?: string
  description?: string
  sortOrder?: number
}

export type UpdateEsgMetricDto = Partial<CreateEsgMetricDto>

export type CreateEsgGovernanceItemDto = {
  title: string
  description: string
  type: 'policy' | 'certification' | 'risk'
  document?: string
  sortOrder?: number
}

export type UpdateEsgGovernanceItemDto = Partial<CreateEsgGovernanceItemDto>

export type CreateEsgReportDto = {
  title: string
  year: string
  type: 'annual' | 'esg' | 'sustainability' | 'other'
  filePath: string
  sortOrder?: number
}

export type UpdateEsgReportDto = Partial<CreateEsgReportDto>

export function uploadEsgFile(file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>('/esg/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getEsgHero(): Promise<EsgHero | null> {
  return apiRequest<EsgHero | null>('/esg/hero')
}

export function updateEsgHero(dto: UpsertEsgHeroDto): Promise<EsgHero> {
  return apiRequest<EsgHero>('/esg/hero', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishEsgHero(): Promise<EsgHero> {
  return apiRequest<EsgHero>('/esg/hero/publish', { method: 'PATCH' })
}

export function unpublishEsgHero(): Promise<EsgHero> {
  return apiRequest<EsgHero>('/esg/hero/unpublish', { method: 'PATCH' })
}

export function getEsgStrategy(): Promise<EsgStrategy | null> {
  return apiRequest<EsgStrategy | null>('/esg/strategy')
}

export function updateEsgStrategy(dto: UpsertEsgStrategyDto): Promise<EsgStrategy> {
  return apiRequest<EsgStrategy>('/esg/strategy', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishEsgStrategy(): Promise<EsgStrategy> {
  return apiRequest<EsgStrategy>('/esg/strategy/publish', { method: 'PATCH' })
}

export function unpublishEsgStrategy(): Promise<EsgStrategy> {
  return apiRequest<EsgStrategy>('/esg/strategy/unpublish', { method: 'PATCH' })
}

export function getEsgLucsBridge(): Promise<EsgLucsBridge | null> {
  return apiRequest<EsgLucsBridge | null>('/esg/lucs-bridge')
}

export function updateEsgLucsBridge(dto: UpsertEsgLucsBridgeDto): Promise<EsgLucsBridge> {
  return apiRequest<EsgLucsBridge>('/esg/lucs-bridge', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishEsgLucsBridge(): Promise<EsgLucsBridge> {
  return apiRequest<EsgLucsBridge>('/esg/lucs-bridge/publish', { method: 'PATCH' })
}

export function unpublishEsgLucsBridge(): Promise<EsgLucsBridge> {
  return apiRequest<EsgLucsBridge>('/esg/lucs-bridge/unpublish', { method: 'PATCH' })
}

export function getEsgPillars(): Promise<EsgPillar[]> {
  return apiRequest<EsgPillar[]>('/esg/pillars')
}

export function createEsgPillar(dto: CreateEsgPillarDto): Promise<EsgPillar> {
  return apiRequest<EsgPillar>('/esg/pillars', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateEsgPillar(id: string, dto: UpdateEsgPillarDto): Promise<EsgPillar> {
  return apiRequest<EsgPillar>(`/esg/pillars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishEsgPillar(id: string): Promise<EsgPillar> {
  return apiRequest<EsgPillar>(`/esg/pillars/${id}/publish`, { method: 'PATCH' })
}

export function unpublishEsgPillar(id: string): Promise<EsgPillar> {
  return apiRequest<EsgPillar>(`/esg/pillars/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteEsgPillar(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/esg/pillars/${id}`, { method: 'DELETE' })
}

export function getEsgMetrics(): Promise<EsgMetric[]> {
  return apiRequest<EsgMetric[]>('/esg/metrics')
}

export function createEsgMetric(dto: CreateEsgMetricDto): Promise<EsgMetric> {
  return apiRequest<EsgMetric>('/esg/metrics', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateEsgMetric(id: string, dto: UpdateEsgMetricDto): Promise<EsgMetric> {
  return apiRequest<EsgMetric>(`/esg/metrics/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishEsgMetric(id: string): Promise<EsgMetric> {
  return apiRequest<EsgMetric>(`/esg/metrics/${id}/publish`, { method: 'PATCH' })
}

export function unpublishEsgMetric(id: string): Promise<EsgMetric> {
  return apiRequest<EsgMetric>(`/esg/metrics/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteEsgMetric(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/esg/metrics/${id}`, { method: 'DELETE' })
}

export function getEsgGovernance(): Promise<EsgGovernanceItem[]> {
  return apiRequest<EsgGovernanceItem[]>('/esg/governance')
}

export function createEsgGovernanceItem(dto: CreateEsgGovernanceItemDto): Promise<EsgGovernanceItem> {
  return apiRequest<EsgGovernanceItem>('/esg/governance', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateEsgGovernanceItem(
  id: string,
  dto: UpdateEsgGovernanceItemDto
): Promise<EsgGovernanceItem> {
  return apiRequest<EsgGovernanceItem>(`/esg/governance/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishEsgGovernanceItem(id: string): Promise<EsgGovernanceItem> {
  return apiRequest<EsgGovernanceItem>(`/esg/governance/${id}/publish`, { method: 'PATCH' })
}

export function unpublishEsgGovernanceItem(id: string): Promise<EsgGovernanceItem> {
  return apiRequest<EsgGovernanceItem>(`/esg/governance/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteEsgGovernanceItem(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/esg/governance/${id}`, { method: 'DELETE' })
}

export function getEsgReports(): Promise<EsgReport[]> {
  return apiRequest<EsgReport[]>('/esg/reports')
}

export function createEsgReport(dto: CreateEsgReportDto): Promise<EsgReport> {
  return apiRequest<EsgReport>('/esg/reports', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateEsgReport(id: string, dto: UpdateEsgReportDto): Promise<EsgReport> {
  return apiRequest<EsgReport>(`/esg/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishEsgReport(id: string): Promise<EsgReport> {
  return apiRequest<EsgReport>(`/esg/reports/${id}/publish`, { method: 'PATCH' })
}

export function unpublishEsgReport(id: string): Promise<EsgReport> {
  return apiRequest<EsgReport>(`/esg/reports/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteEsgReport(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/esg/reports/${id}`, { method: 'DELETE' })
}
