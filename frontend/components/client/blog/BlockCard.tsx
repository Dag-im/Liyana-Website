'use client';

import { BlogPost } from '@/data/blogs';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 200 }}
      className="rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition overflow-hidden hover:-translate-y-3"
    >
      <Link href={`/blog/${post.slug}`}>
        <Image
          src={post.image}
          alt={post.title}
          width={600}
          height={400}
          className="h-48 w-full object-cover"
        />
        <div className="p-5">
          <span className="text-xs font-semibold uppercase text-cyan-600">
            {post.category}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-gray-800 line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4 text-cyan-500" />
            {post.date}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
