'use client';

import { BlogPost } from '@/data/blogs';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Image from 'next/image';

export default function BlogDetail({ blog }: { blog: BlogPost }) {
  return (
    <article className="prose prose-lg mx-auto w-full max-w-5xl text-gray-800 prose-headings:text-gray-900 prose-img:rounded-xl prose-a:text-cyan-600">
      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-10 h-100 w-full overflow-hidden rounded-2xl shadow-lg"
      >
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Meta Info */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {blog.date}
        </span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
          {blog.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-6 text-3xl font-bold leading-tight">{blog.title}</h1>

      {/* Content */}
      <div className="space-y-6 leading-relaxed">
        {blog.content.map((para, i) => (
          <p key={i} className="text-gray-700">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
