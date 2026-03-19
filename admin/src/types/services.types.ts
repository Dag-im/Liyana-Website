export type DivisionCategory = {
  id: string
  name: string
  label: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type ServiceCategory = {
  id: string
  title: string
  tagline: string
  heroImage: string
  icon: string
  attributes: string[]
  sortOrder: number
  divisions: Division[]
  // When listing service categories, the backend returns a relation
  // count instead of full division relations for performance.
  divisionsCount?: number
  createdAt: string
  updatedAt: string
}

export type Division = {
  id: string
  slug: string
  name: string
  shortName: string
  location: string | null
  overview: string
  logo: string | null
  description: string[]
  groupPhoto: string | null
  isActive: boolean
  serviceCategoryId: string
  divisionCategoryId: string
  divisionCategory: DivisionCategory
  serviceCategory: ServiceCategory
  images: DivisionImage[]
  coreServices: DivisionCoreService[]
  stats: DivisionStat[]
  doctors: Doctor[]
  contact: DivisionContact | null
  createdAt: string
  updatedAt: string
}

export type DivisionImage = {
  id: string
  path: string
  sortOrder: number
}

export type DivisionCoreService = {
  id: string
  name: string
  sortOrder: number
}

export type DivisionStat = {
  id: string
  label: string
  value: string
  sortOrder: number
}

export type DivisionContact = {
  id: string
  phone: string | null
  email: string | null
  address: string | null
  googleMap: string | null
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  image: string | null
  availability: string
  divisionId: string
}
