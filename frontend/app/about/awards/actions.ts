'use server';

import { getAwards } from '@/lib/api/awards.api';
import type { Award } from '@/types/awards.types';

export async function filterAwards(params: {
  category?: string;
  page?: number;
}): Promise<{ data: Award[]; total: number; page: number; perPage: number }> {
  const perPage = 12;
  const page = params.page ?? 1;

  try {
    const res = await getAwards({
      category: params.category,
      perPage: 100,
    });

    const total = Math.min(res.total, res.data.length);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      data: res.data.slice(start, end),
      total,
      page,
      perPage,
    };
  } catch {
    return { data: [], total: 0, page: 1, perPage };
  }
}
