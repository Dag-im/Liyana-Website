export type LucsHero = {
  tagline: string
  subtitle: string
  backgroundImage: string | null
  isPublished: boolean
  updatedAt: string
}

export type LucsWhoWeAre = {
  content: string
  isPublished: boolean
  updatedAt: string
}

export type LucsMission = {
  missionTitle: string
  missionDescription: string
  missionIcon: string
  visionTitle: string
  visionDescription: string
  visionIcon: string
  isPublished: boolean
  updatedAt: string
}

export type LucsPillarIntro = {
  title: string
  description: string
  isPublished: boolean
  updatedAt: string
}

export type LucsBulletPoint = {
  id: string
  point: string
  description: string | null
}

export type LucsPillar = {
  id: string
  title: string
  description: string | null
  icon: string
  sortOrder: number
  isPublished: boolean
  bulletPoints: LucsBulletPoint[]
}

export type LucsCta = {
  title: string
  description: string | null
  ctaType: 'phone' | 'email' | 'url'
  ctaValue: string
  ctaLabel: string
  isPublished: boolean
  updatedAt: string
}
