import BlogIndexPageClient from '@/app/blog/BlogIndexPageClient';

export const revalidate = 600;

export default function BlogIndexPage() {
  return <BlogIndexPageClient />;
}
