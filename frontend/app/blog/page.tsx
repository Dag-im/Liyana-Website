'use client';

import BlogCard from '@/components/client/blog/BlockCard';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { blogPosts, getInitials } from '@/data/blogs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  // Logic for Search, Category, Latest, and Featured filtering
  const filteredPosts = useMemo(() => {
    // 1. Sort by Latest Date
    let posts = [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 2. Apply Search Filter
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.excerpt.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Apply Category Filter
    if (activeCategory !== 'All') {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    return posts;
  }, [searchQuery, activeCategory]);

  // Determine if we should show the Featured Hero section
  const isDefaultView = searchQuery.trim() === '' && activeCategory === 'All';
  const featuredPost = isDefaultView
    ? filteredPosts.find((p) => p.featured) || filteredPosts[0]
    : null;

  // The grid posts exclude the featured post if we are in the default view
  const gridPosts =
    isDefaultView && featuredPost
      ? filteredPosts.filter((p) => p.id !== featuredPost.id)
      : filteredPosts;

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      if (gridRef.current) {
        gsap.fromTo(
          '.gsap-blog-card',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
            clearProps: 'all',
          }
        );
      }
    });

    return () => ctx.revert();
  }, [activeCategory, searchQuery, isDefaultView]);

  return (
    <main className="min-h-screen bg-white selection:bg-cyan-100 selection:text-cyan-900 pb-24">
      {/* Page Header */}
      <header className="bg-white border-b border-slate-200 pt-14 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-cyan-600" />
              <span className="text-cyan-700 font-bold uppercase tracking-widest text-sm">
                Corporate Insights
              </span>
            </div>
            <SectionHeading
              variant="large"
              align="left"
              weight="bold"
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-600 mb-6"
            >
              Insights & Perspectives
            </SectionHeading>
            <p className="text-xl text-slate-600 leading-relaxed">
              Thought leadership, strategic analysis, and informed viewpoints
              shaping our industry and organization.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative shrink-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-sm focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Featured Post (Only shows when no filters/searches are applied) */}
        {isDefaultView && featuredPost && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
              Featured Insight
            </h2>
            <article
              ref={heroRef}
              className="bg-white border border-slate-200 rounded-sm overflow-hidden group flex flex-col lg:flex-row hover:shadow-xl transition-shadow duration-500"
            >
              <div className="lg:w-3/5 relative min-h-[400px] bg-slate-100 overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
              </div>

              <div className="lg:w-2/5 p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-sm">
                    {featuredPost.category}
                  </span>
                  <span className="text-slate-500">{featuredPost.date}</span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-cyan-700 transition-colors tracking-tight leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-auto pt-8 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
                      {getInitials(featuredPost.author.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {featuredPost.author.name}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                        {featuredPost.author.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="w-12 h-12 flex items-center justify-center bg-slate-50 group-hover:bg-cyan-600 text-slate-400 group-hover:text-white rounded-sm transition-colors duration-300"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Category Filter & Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight shrink-0">
            {searchQuery ? 'Search Results' : 'Latest Insights'}
          </h2>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors duration-300 border-b-2 -mb-[1px] md:-mb-[2px] whitespace-nowrap ${
                  activeCategory === cat
                    ? 'border-cyan-600 text-cyan-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <div key={post.id} className="gsap-blog-card h-full">
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {gridPosts.length === 0 && (
          <div className="text-center py-32 bg-white border border-slate-200 rounded-sm mt-8">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No results found
            </h3>
            <p className="text-slate-500 text-base max-w-sm mx-auto">
              We couldn&apos;t find any articles matching your search criteria.
              Try adjusting your filters or search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-6 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
