'use server';

import { getBlogs } from '@/lib/api/blog.api';
import type { Blog } from '@/types/blog.types';

export async function filterBlogs(params: {
  categoryId?: string;
  search?: string;
  page?: number;
}): Promise<{ data: Blog[]; total: number; page: number; perPage: number }> {
  try {
    return await getBlogs({
      page: params.page ?? 1,
      perPage: 12,
      categoryId: params.categoryId,
      search: params.search,
    });
  } catch {
    return { data: [], total: 0, page: 1, perPage: 12 };
  }
}
