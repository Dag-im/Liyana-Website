import { apiRequest } from '@/lib/api-client';
import { REVALIDATE } from '@/lib/revalidation';
import type { Blog, BlogCategory } from '@/types/blog.types';

export type BlogListPayload = {
  data: Blog[];
  total: number;
  page: number;
  perPage: number;
};

export async function getBlogs(params?: {
  page?: number;
  perPage?: number;
  categoryId?: string;
  featured?: boolean;
}): Promise<BlogListPayload> {
  const query = new URLSearchParams();
  query.set('status', 'PUBLISHED');

  if (params?.page) {
    query.set('page', String(params.page));
  }

  query.set('perPage', String(params?.perPage ?? 20));

  if (params?.categoryId) {
    query.set('categoryId', params.categoryId);
  }

  if (params?.featured !== undefined) {
    query.set('featured', String(params.featured));
  }

  return apiRequest<BlogListPayload>(`/blogs?${query.toString()}`, {
    next: { revalidate: REVALIDATE.CONTENT, tags: ['blogs'] },
  });
}

export async function getBlog(id: string): Promise<Blog> {
  return apiRequest<Blog>(`/blogs/${id}`, {
    next: { revalidate: REVALIDATE.CONTENT, tags: ['blogs', `blog-${id}`] },
  });
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const result = await getBlogs({ perPage: 100 });
  return result.data.find((blog) => blog.slug === slug) ?? null;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return apiRequest<BlogCategory[]>('/blog-categories', {
    next: { revalidate: REVALIDATE.SERVICES, tags: ['blog-categories'] },
  });
}

export async function getFeaturedBlog(): Promise<Blog | null> {
  const result = await getBlogs({ featured: true, perPage: 1 });
  return result.data[0] ?? null;
}
