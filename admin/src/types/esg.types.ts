export type EsgHero = {
  tagline: string
  subtitle: string
  backgroundImage: string | null
  isPublished: boolean
  updatedAt: string
}

export type EsgPillarInitiative = {
  id: string
  text: string
  sortOrder: number
}

export type EsgPillar = {
  id: string
  title: string
  description: string
  icon: string
  sortOrder: number
  isPublished: boolean
  document: string | null
  initiatives: EsgPillarInitiative[]
}

export type EsgMetric = {
  id: string
  label: string
  value: string
  suffix: string | null
  description: string | null
  sortOrder: number
  isPublished: boolean
}

export type EsgGovernanceItem = {
  id: string
  title: string
  description: string
  type: 'policy' | 'certification' | 'risk'
  document: string | null
  sortOrder: number
  isPublished: boolean
}

export type EsgReport = {
  id: string
  title: string
  year: string
  type: 'annual' | 'esg' | 'sustainability' | 'other'
  filePath: string
  sortOrder: number
  isPublished: boolean
}

export type EsgStrategy = {
  content: string
  isPublished: boolean
  updatedAt: string
}

export type EsgLucsBridge = {
  title: string
  description: string
  buttonText: string
  isPublished: boolean
  updatedAt: string
}
