export type FaqCategory = {
  id: string
  name: string
  slug: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type Faq = {
  id: string
  question: string
  answer: string
  position: number
  categoryId: string
  category: FaqCategory
  createdAt: string
  updatedAt: string
}
