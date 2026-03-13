export type BlogStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED'

export type BlogCategory = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  readTime: string
  featured: boolean
  status: BlogStatus
  rejectionReason: string | null
  publishedAt: string | null
  authorId: string
  authorName: string
  authorRole: string
  categoryId: string
  category: BlogCategory
  createdAt: string
  updatedAt: string
}
