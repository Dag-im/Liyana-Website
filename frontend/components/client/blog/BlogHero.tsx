'use client';

import { BlogPost } from '@/data/blogs';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogHero({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl overflow-hidden shadow-lg border bg-white"
    >
      <Link href={`/blog/${post.slug}`}>
        <Image
          src={post.image}
          alt={post.title}
          width={900}
          height={500}
          className="w-full h-72 object-cover"
        />
        <div className="p-6">
          <span className="text-xs font-semibold uppercase text-cyan-600">
            {post.category}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            {post.title}
          </h2>
          <p className="mt-3 text-gray-600">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4 text-cyan-500" />
            {post.date}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
