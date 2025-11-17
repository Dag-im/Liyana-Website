'use client';

import BlogHero from '@/components/client/blog/BlogHero';
import BlogList from '@/components/client/blog/BlogList';
import BlogSectionHeading from '@/components/client/blog/BlogSectionHeading';
import FeaturedBlogsGrid from '@/components/client/blog/FeaturedBlogsCard';
import { BLOGS } from '@/data/blogs';
import { ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const heroPost = BLOGS[0];
  const featuredPosts = BLOGS.slice(1, 4);
  const categories = [...new Set(BLOGS.map((b) => b.category))];

  // Filter logic memoized for performance
  const filteredPosts = useMemo(() => {
    return BLOGS.filter((b) => {
      const matchesSearch = b.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = selectedCategory
        ? b.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Check if filtering by category
  const isFilteringByCategory = Boolean(selectedCategory);

  return (
    <div className="container mx-auto px-6 lg:px-10 py-24 bg-gray-50 min-h-screen">
      {/* Heading */}
      <div className="text-center mb-16">
        <BlogSectionHeading>Insights & Articles</BlogSectionHeading>
        <p className="text-gray-500 text-base mt-2">
          Explore expert healthcare insights and the latest wellness stories.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-600 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 outline-none transition-all"
            />
          </div>

          {search && (
            <ul className="absolute top-14 left-0 right-0 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3 mt-2 z-10 border border-gray-100 max-h-56 overflow-y-auto">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-cyan-50 rounded-md transition"
                      onClick={() => setSearch('')}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 px-3 py-2">
                  No results found.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full md:w-56">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-medium flex items-center justify-between hover:border-cyan-400 transition"
          >
            {selectedCategory || 'Select Category'}
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul className="absolute top-14 left-0 right-0 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-100 z-20">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 rounded-t-lg"
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === cat
                        ? 'text-cyan-700 bg-cyan-50 font-medium'
                        : 'text-gray-700 hover:bg-cyan-50'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main content */}
        <main className="lg:col-span-8 space-y-16">
          {!isFilteringByCategory && (
            <>
              {/* Hero Section */}
              <section className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <BlogHero post={heroPost} />
              </section>

              {/* Blog List */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-cyan-700">
                    Latest Articles
                  </h2>
                </div>
                <BlogList posts={filteredPosts.slice(1)} />
              </section>
            </>
          )}

          {isFilteringByCategory && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-cyan-700">
                  {selectedCategory} Articles
                </h2>
              </div>
              {filteredPosts.length > 0 ? (
                <BlogList posts={filteredPosts} />
              ) : (
                <p className="text-gray-500 text-sm">
                  No articles found in this category.
                </p>
              )}
            </section>
          )}
        </main>

        {/* Sidebar (only when not filtering) */}
        {!isFilteringByCategory && (
          <aside className="lg:col-span-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-cyan-700 mb-6">
                Featured Stories
              </h2>
              <FeaturedBlogsGrid posts={featuredPosts} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
