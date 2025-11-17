'use client';

import { BLOGS } from '@/data/blogs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function BlogSidebar({ currentSlug }: { currentSlug?: string }) {
  const [search, setSearch] = useState('');
  const recentPosts = BLOGS.filter((b) => b.slug !== currentSlug).slice(0, 3);
  const categories = [...new Set(BLOGS.map((b) => b.category))];

  const filteredPosts = BLOGS.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside>
      {/* Search */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-cyan-700">Search</h3>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-600"
        />
        {search && (
          <ul className="mt-4 space-y-2">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-gray-700 hover:text-cyan-700 transition text-sm"
                  >
                    {p.title}
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 mt-2">No results found</p>
            )}
          </ul>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-cyan-700">Categories</h3>
        <ul className="space-y-2 text-sm">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className="text-gray-600 hover:text-cyan-700 transition"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-cyan-700">
          Recent Posts
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post.id} className="flex items-center gap-3">
              <Image
                src={post.image}
                alt={post.title}
                width={64}
                height={64}
                className="h-16 w-16 rounded-md object-cover"
              />
              <Link
                href={`/blog/${post.slug}`}
                className="line-clamp-2 text-sm text-gray-700 hover:text-cyan-700 transition"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
