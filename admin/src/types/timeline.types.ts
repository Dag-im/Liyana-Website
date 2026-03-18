export type TimelineCategory = 'milestone' | 'achievement' | 'expansion' | 'innovation'

export type TimelineItem = {
  id: string
  year: string
  title: string
  description: string
  location: string | null
  achievement: string | null
  image: string | null
  category: TimelineCategory | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}
