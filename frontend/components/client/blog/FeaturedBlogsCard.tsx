'use client';

import { BlogPost } from '@/data/blogs';
import BlogCard from './BlockCard';

type FeaturedBlogsGridProps = {
  posts: BlogPost[];
};

export default function FeaturedBlogsGrid({ posts }: FeaturedBlogsGridProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="grid gap-6 grid-cols-1 md:sticky top-10">
      {posts.map((post, key) => (
        <BlogCard key={key} post={post} />
      ))}
    </section>
  );
}
