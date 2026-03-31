import { apiRequest } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/user.types'
import type {
  IrContact,
  IrDocument,
  IrFinancialColumn,
  IrFinancialRow,
  IrHero,
  IrInquiry,
  IrKpi,
  IrStrategy,
} from '@/types/ir.types'
import type { UploadedAsset } from '@/types/uploads.types'

const toQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export type UpsertIrHeroDto = {
  tagline?: string
  subtitle?: string
}

export type UpsertIrStrategyDto = {
  content?: string
}

export type UpsertIrContactDto = {
  email?: string
  phone?: string
  address?: string
  description?: string
}

export type CreateIrKpiDto = {
  label: string
  value: string
  suffix?: string
  icon: string
  sortOrder?: number
}

export type UpdateIrKpiDto = Partial<CreateIrKpiDto>

export type CreateIrFinancialColumnDto = {
  label: string
  key: string
  sortOrder?: number
}

export type UpdateIrFinancialColumnDto = Partial<CreateIrFinancialColumnDto>

export type IrFinancialRowCellInput = {
  columnId: string
  value: string
}

export type CreateIrFinancialRowDto = {
  period: string
  periodType: 'annual' | 'quarterly'
  sortOrder?: number
  cells: IrFinancialRowCellInput[]
}

export type UpdateIrFinancialRowDto = Partial<CreateIrFinancialRowDto>

export type CreateIrDocumentDto = {
  title: string
  year: string
  category: 'report' | 'presentation' | 'filing' | 'other'
  filePath: string
  sortOrder?: number
}

export type UpdateIrDocumentDto = Partial<CreateIrDocumentDto>

export type CreateIrInquiryDto = {
  name: string
  email: string
  message: string
}

export type GetIrInquiriesParams = {
  page?: number
  perPage?: number
  search?: string
  isReviewed?: boolean
}

export function uploadIrFile(file: File): Promise<UploadedAsset> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedAsset>('/ir/upload', {
    method: 'POST',
    body: formData,
  })
}

export function getIrHero(): Promise<IrHero | null> {
  return apiRequest<IrHero | null>('/ir/hero')
}

export function updateIrHero(dto: UpsertIrHeroDto): Promise<IrHero> {
  return apiRequest<IrHero>('/ir/hero', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishIrHero(): Promise<IrHero> {
  return apiRequest<IrHero>('/ir/hero/publish', { method: 'PATCH' })
}

export function unpublishIrHero(): Promise<IrHero> {
  return apiRequest<IrHero>('/ir/hero/unpublish', { method: 'PATCH' })
}

export function getIrStrategy(): Promise<IrStrategy | null> {
  return apiRequest<IrStrategy | null>('/ir/strategy')
}

export function updateIrStrategy(dto: UpsertIrStrategyDto): Promise<IrStrategy> {
  return apiRequest<IrStrategy>('/ir/strategy', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishIrStrategy(): Promise<IrStrategy> {
  return apiRequest<IrStrategy>('/ir/strategy/publish', { method: 'PATCH' })
}

export function unpublishIrStrategy(): Promise<IrStrategy> {
  return apiRequest<IrStrategy>('/ir/strategy/unpublish', { method: 'PATCH' })
}

export function getIrContact(): Promise<IrContact | null> {
  return apiRequest<IrContact | null>('/ir/contact')
}

export function updateIrContact(dto: UpsertIrContactDto): Promise<IrContact> {
  return apiRequest<IrContact>('/ir/contact', {
    method: 'PUT',
    body: JSON.stringify(dto),
  })
}

export function publishIrContact(): Promise<IrContact> {
  return apiRequest<IrContact>('/ir/contact/publish', { method: 'PATCH' })
}

export function unpublishIrContact(): Promise<IrContact> {
  return apiRequest<IrContact>('/ir/contact/unpublish', { method: 'PATCH' })
}

export function getIrKpis(): Promise<IrKpi[]> {
  return apiRequest<IrKpi[]>('/ir/kpis')
}

export function createIrKpi(dto: CreateIrKpiDto): Promise<IrKpi> {
  return apiRequest<IrKpi>('/ir/kpis', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateIrKpi(id: string, dto: UpdateIrKpiDto): Promise<IrKpi> {
  return apiRequest<IrKpi>(`/ir/kpis/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishIrKpi(id: string): Promise<IrKpi> {
  return apiRequest<IrKpi>(`/ir/kpis/${id}/publish`, { method: 'PATCH' })
}

export function unpublishIrKpi(id: string): Promise<IrKpi> {
  return apiRequest<IrKpi>(`/ir/kpis/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteIrKpi(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/ir/kpis/${id}`, { method: 'DELETE' })
}

export function getIrFinancialColumns(): Promise<IrFinancialColumn[]> {
  return apiRequest<IrFinancialColumn[]>('/ir/financial-columns')
}

export function createIrFinancialColumn(dto: CreateIrFinancialColumnDto): Promise<IrFinancialColumn> {
  return apiRequest<IrFinancialColumn>('/ir/financial-columns', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateIrFinancialColumn(
  id: string,
  dto: UpdateIrFinancialColumnDto
): Promise<IrFinancialColumn> {
  return apiRequest<IrFinancialColumn>(`/ir/financial-columns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteIrFinancialColumn(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/ir/financial-columns/${id}`, { method: 'DELETE' })
}

export function getIrFinancialRows(): Promise<{ columns: IrFinancialColumn[]; rows: IrFinancialRow[] }> {
  return apiRequest<{ columns: IrFinancialColumn[]; rows: IrFinancialRow[] }>('/ir/financial-rows')
}

export function createIrFinancialRow(dto: CreateIrFinancialRowDto): Promise<IrFinancialRow> {
  return apiRequest<IrFinancialRow>('/ir/financial-rows', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateIrFinancialRow(id: string, dto: UpdateIrFinancialRowDto): Promise<IrFinancialRow> {
  return apiRequest<IrFinancialRow>(`/ir/financial-rows/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishIrFinancialRow(id: string): Promise<IrFinancialRow> {
  return apiRequest<IrFinancialRow>(`/ir/financial-rows/${id}/publish`, { method: 'PATCH' })
}

export function unpublishIrFinancialRow(id: string): Promise<IrFinancialRow> {
  return apiRequest<IrFinancialRow>(`/ir/financial-rows/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteIrFinancialRow(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/ir/financial-rows/${id}`, { method: 'DELETE' })
}

export function getIrDocuments(): Promise<IrDocument[]> {
  return apiRequest<IrDocument[]>('/ir/documents')
}

export function createIrDocument(dto: CreateIrDocumentDto): Promise<IrDocument> {
  return apiRequest<IrDocument>('/ir/documents', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateIrDocument(id: string, dto: UpdateIrDocumentDto): Promise<IrDocument> {
  return apiRequest<IrDocument>(`/ir/documents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function publishIrDocument(id: string): Promise<IrDocument> {
  return apiRequest<IrDocument>(`/ir/documents/${id}/publish`, { method: 'PATCH' })
}

export function unpublishIrDocument(id: string): Promise<IrDocument> {
  return apiRequest<IrDocument>(`/ir/documents/${id}/unpublish`, { method: 'PATCH' })
}

export function deleteIrDocument(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/ir/documents/${id}`, { method: 'DELETE' })
}

export function createIrInquiry(dto: CreateIrInquiryDto): Promise<IrInquiry> {
  return apiRequest<IrInquiry>('/ir/inquiries', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function getIrInquiries(params: GetIrInquiriesParams): Promise<PaginatedResponse<IrInquiry>> {
  return apiRequest<PaginatedResponse<IrInquiry>>(`/ir/inquiries${toQueryString(params)}`)
}

export function getIrInquiry(id: string): Promise<IrInquiry> {
  return apiRequest<IrInquiry>(`/ir/inquiries/${id}`)
}

export function reviewIrInquiry(id: string): Promise<IrInquiry> {
  return apiRequest<IrInquiry>(`/ir/inquiries/${id}/review`, { method: 'PATCH' })
}

export function deleteIrInquiry(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/ir/inquiries/${id}`, { method: 'DELETE' })
}
