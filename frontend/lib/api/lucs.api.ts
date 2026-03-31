import { apiRequest } from '@/lib/api-client'
import { REVALIDATE } from '@/lib/revalidation'
import type {
  LucsCta,
  LucsHero,
  LucsMission,
  LucsPillar,
  LucsPillarIntro,
  LucsWhoWeAre,
} from '@/types/lucs.types'

export async function getLucsHero(): Promise<LucsHero | null> {
  return apiRequest<LucsHero | null>('/lucs/hero', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'hero'] },
  })
}

export async function getLucsWhoWeAre(): Promise<LucsWhoWeAre | null> {
  return apiRequest<LucsWhoWeAre | null>('/lucs/who-we-are', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'who-we-are'] },
  })
}

export async function getLucsMission(): Promise<LucsMission | null> {
  return apiRequest<LucsMission | null>('/lucs/mission', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'mission'] },
  })
}

export async function getLucsPillarIntro(): Promise<LucsPillarIntro | null> {
  return apiRequest<LucsPillarIntro | null>('/lucs/pillar-intro', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'pillar-intro'] },
  })
}

export async function getLucsPillars(): Promise<LucsPillar[]> {
  return apiRequest<LucsPillar[]>('/lucs/pillars', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'pillars'] },
  })
}

export async function getLucsCta(): Promise<LucsCta | null> {
  return apiRequest<LucsCta | null>('/lucs/cta', {
    next: { revalidate: REVALIDATE.LUCS, tags: ['lucs', 'cta'] },
  })
}

export async function submitLucsInquiry(dto: {
  name: string
  email: string
  message: string
}): Promise<{ id: string }> {
  return apiRequest<{ id: string }>('/lucs/inquiries', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}
