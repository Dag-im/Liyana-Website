import { apiRequest } from '@/lib/api-client'
import { REVALIDATE } from '@/lib/revalidation'
import type {
  IrChart,
  IrContact,
  IrDivisionPerformance,
  IrDocument,
  IrFinancialColumn,
  IrFinancialRow,
  IrHero,
  IrKpi,
  IrStrategy,
} from '@/types/ir.types'

export async function getIrHero(): Promise<IrHero | null> {
  return apiRequest<IrHero | null>('/ir/hero', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'hero'] },
  })
}

export async function getIrStrategy(): Promise<IrStrategy | null> {
  return apiRequest<IrStrategy | null>('/ir/strategy', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'strategy'] },
  })
}

export async function getIrContact(): Promise<IrContact | null> {
  return apiRequest<IrContact | null>('/ir/contact', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'contact'] },
  })
}

export async function getIrKpis(): Promise<IrKpi[]> {
  return apiRequest<IrKpi[]>('/ir/kpis', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'kpis'] },
  })
}

export async function getIrFinancialTable(): Promise<{
  columns: IrFinancialColumn[]
  rows: IrFinancialRow[]
}> {
  return apiRequest<{ columns: IrFinancialColumn[]; rows: IrFinancialRow[] }>(
    '/ir/financial-rows',
    {
      next: { revalidate: REVALIDATE.IR, tags: ['ir', 'financial-rows'] },
    }
  )
}

export async function getIrDivisionPerformance(): Promise<IrDivisionPerformance[]> {
  return apiRequest<IrDivisionPerformance[]>('/ir/division-performance', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'division-performance'] },
  })
}

export async function getIrCharts(): Promise<IrChart[]> {
  return apiRequest<IrChart[]>('/ir/charts', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'charts'] },
  })
}

export async function getIrDocuments(): Promise<IrDocument[]> {
  return apiRequest<IrDocument[]>('/ir/documents', {
    next: { revalidate: REVALIDATE.IR, tags: ['ir', 'documents'] },
  })
}

export async function submitIrInquiry(dto: {
  name: string
  email: string
  message: string
}): Promise<{ id: string }> {
  return apiRequest<{ id: string }>('/ir/inquiries', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}
