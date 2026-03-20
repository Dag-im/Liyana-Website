import { JsonLd } from '@/components/shared/JsonLd';
import {
  getBlogCategories,
  getBlogs,
  getFeaturedBlog,
} from '@/lib/api/blog.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { Blog, BlogCategory } from '@/types/blog.types';
import type { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights, innovations, and perspectives from the Liyana Healthcare leadership team — covering healthcare technology, clinical excellence, sustainability, and the future of medicine in East Africa.',
  openGraph: {
    title: 'Blog | Liyana Healthcare',
    description:
      'Insights and perspectives from the Liyana Healthcare leadership team.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  let initialBlogs: Blog[] = [];
  let initialTotal = 0;
  let categories: BlogCategory[] = [];
  let featuredBlog: Blog | null = null;

  await Promise.allSettled([
    getBlogs({ perPage: 12, page: 1 }).then((res) => {
      initialBlogs = res.data;
      initialTotal = res.total;
    }),
    getBlogCategories().then((data) => {
      categories = data;
    }),
    getFeaturedBlog().then((data) => {
      featuredBlog = data;
    }),
  ]);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Blog', url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <BlogListClient
        initialBlogs={initialBlogs}
        initialTotal={initialTotal}
        categories={categories}
        featuredBlog={featuredBlog}
      />
    </>
  );
}
