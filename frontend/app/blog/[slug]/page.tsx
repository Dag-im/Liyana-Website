import BlogPostPageClient from '@/app/blog/[slug]/BlogPostPageClient';
import { JsonLd } from '@/components/shared/JsonLd';
import { getFileUrl } from '@/lib/api-client';
import { getBlogBySlug, getBlogs } from '@/lib/api/blog.api';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/structured-data';
import type { Blog } from '@/types/blog.types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await getBlogs({ perPage: 200 });
    return res.data.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return {};

    const imageUrl = getFileUrl(blog.image);

    return {
      title: blog.title,
      description: blog.excerpt,
      authors: [{ name: blog.authorName }],
      openGraph: {
        title: `${blog.title} | Liyana Healthcare`,
        description: blog.excerpt,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`,
        type: 'article',
        publishedTime: blog.publishedAt ?? undefined,
        authors: [blog.authorName],
        images: imageUrl ? [{ url: imageUrl, alt: blog.title }] : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let blog: Blog | null = null;
  let relatedPosts: Blog[] = [];

  try {
    blog = await getBlogBySlug(slug);
  } catch {}

  if (!blog) notFound();

  try {
    const related = await getBlogs({
      perPage: 4,
      categoryId: blog.categoryId,
    });
    relatedPosts = related.data.filter((p) => p.id !== blog.id).slice(0, 3);
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    { name: 'Blog', url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
    {
      name: blog.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`,
    },
  ]);

  const structuredData = blogPostingSchema({
    title: blog.title,
    excerpt: blog.excerpt,
    slug: blog.slug,
    authorName: blog.authorName,
    publishedAt: blog.publishedAt,
    image: getFileUrl(blog.image) ?? blog.image,
    category: blog.category.name,
  });

  return (
    <>
      <JsonLd data={[structuredData, breadcrumb]} />
      <BlogPostPageClient post={blog} relatedPosts={relatedPosts} />
    </>
  );
}
