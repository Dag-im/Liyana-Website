export type IrHero = {
  tagline: string
  subtitle: string
  isPublished: boolean
  updatedAt: string
}

export type IrStrategy = {
  content: string
  isPublished: boolean
  updatedAt: string
}

export type IrContact = {
  email: string
  phone: string | null
  address: string | null
  description: string | null
  isPublished: boolean
  updatedAt: string
}

export type IrKpi = {
  id: string
  label: string
  value: string
  suffix: string | null
  icon: string
  sortOrder: number
  isPublished: boolean
}

export type IrFinancialColumn = {
  id: string
  label: string
  key: string
  sortOrder: number
}

export type IrFinancialCell = {
  id: string
  columnId: string
  column: IrFinancialColumn
  value: string
}

export type IrFinancialRow = {
  id: string
  period: string
  periodType: 'annual' | 'quarterly'
  sortOrder: number
  isPublished: boolean
  cells: IrFinancialCell[]
}

export type IrDocument = {
  id: string
  title: string
  year: string
  category: 'report' | 'presentation' | 'filing' | 'other'
  filePath: string
  sortOrder: number
  isPublished: boolean
}

export type IrInquiry = {
  id: string
  name: string
  email: string
  message: string
  isReviewed: boolean
  reviewedAt: string | null
  createdAt: string
}
