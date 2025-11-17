import BlogDetail from '@/components/client/blog/BlogDetail';
import { BLOGS as blogs } from '@/data/blogs';
import { notFound } from 'next/navigation';
import { use } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function BlogDetailPage(props: Props) {
  const { slug } = use(props.params);

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetail blog={blog} />;
}
