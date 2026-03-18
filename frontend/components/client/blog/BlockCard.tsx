'use client';

import { getInitials } from '@/data/blogs';
import type { Blog } from '@/types/blog.types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  post: Blog;
}

function formatBlogDate(post: Blog) {
  return post.publishedAt ?? post.createdAt;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col h-full bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link
        href={`/blog/${post.slug}`}
        className="block relative w-full h-56 bg-slate-100 overflow-hidden shrink-0"
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm rounded-sm z-10">
          {post.category.name}
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <span>{formatBlogDate(post)}</span>
          <span className="text-cyan-600">{post.readTime}</span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Corporate Initials Avatar */}
            <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
              {getInitials(post.authorName)}
            </div>
            <span className="text-sm font-bold text-slate-900 line-clamp-1">
              {post.authorName}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-cyan-700 uppercase tracking-wider group-hover:text-cyan-800 transition-colors shrink-0"
          >
            Read{' '}
            <ArrowRight
              size={16}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
