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

export type IrDivisionPerformance = {
  id: string
  divisionName: string
  divisionId: string | null
  revenuePercent: string
  growthPercent: string
  tag: string
  sortOrder: number
  isPublished: boolean
}

export type IrChartDataPoint = {
  id: string
  label: string
  value: number
  color: string | null
  sortOrder: number
}

export type IrChart = {
  id: string
  title: string
  type: 'line' | 'pie' | 'bar'
  sortOrder: number
  isPublished: boolean
  dataPoints: IrChartDataPoint[]
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
