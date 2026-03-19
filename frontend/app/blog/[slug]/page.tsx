import BlogPostPageClient from '@/app/blog/[slug]/BlogPostPageClient';
import { getBlogs } from '@/lib/api/blog.api';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const result = await getBlogs({ perPage: 200 });
    return result.data.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export default function BlogPostPage(props: PageProps) {
  return <BlogPostPageClient {...props} />;
}
