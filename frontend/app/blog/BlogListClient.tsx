'use client';

import BlogCard from '@/components/client/blog/BlockCard';
import BackendImage from '@/components/shared/BackendImage';
import BrandLoader from '@/components/shared/BrandLoader';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Blog, BlogCategory } from '@/types/blog.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, ChevronsUpDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import { filterBlogs } from './actions';

type BlogListClientProps = {
  initialBlogs: Blog[];
  initialTotal: number;
  categories: BlogCategory[];
  featuredBlog: Blog | null;
};

function getInitials(name: string | null) {
  return (name?.trim() || 'Unknown Author')
    .split(' ')
    .filter((part) => part.length > 0 && part.toUpperCase() !== 'DR.')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function getAuthorName(name: string | null) {
  return name?.trim() || 'Unknown Author';
}

function getAuthorRole(role: string | null) {
  return role?.trim() || 'Blogger';
}

function formatBlogDate(value: string | null) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

export default function BlogListClient({
  initialBlogs,
  initialTotal,
  categories,
  featuredBlog,
}: BlogListClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const isDefaultView = searchQuery.trim() === '' && activeCategory === '';

  const categoriesWithAll: BlogCategory[] = [
    { id: '', name: 'All', slug: 'all' },
    ...categories,
  ];
  const selectedCategoryLabel =
    categoriesWithAll.find((category) => category.id === activeCategory)?.name ??
    'All';
  const filteredCategories = categoriesWithAll.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

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
          },
        );
      }
    });

    return () => ctx.revert();
  }, [blogs, isDefaultView]);

  useEffect(() => {
    if (isDefaultView) {
      setBlogs(initialBlogs);
      setTotal(initialTotal);
      setPage(1);
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const result = await filterBlogs({
          categoryId: activeCategory || undefined,
          search: searchQuery.trim() || undefined,
          page: 1,
        });
        setBlogs(result.data);
        setTotal(result.total);
        setPage(1);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, activeCategory, isDefaultView, initialBlogs, initialTotal]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await filterBlogs({
        categoryId: activeCategory || undefined,
        search: searchQuery.trim() || undefined,
        page: nextPage,
      });

      setBlogs((prev) => [...prev, ...result.data]);
      setPage(nextPage);
    });
  };

  const hasMore = blogs.length < total;

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
        {isDefaultView && featuredBlog && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
              Featured Insight
            </h2>
            <article
              ref={heroRef}
              className="bg-white border border-slate-200 rounded-sm overflow-hidden group flex flex-col lg:flex-row hover:shadow-xl transition-shadow duration-500"
            >
              <div className="lg:w-3/5 relative min-h-[400px] bg-slate-100 overflow-hidden">
                <BackendImage
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                />
              </div>

              <div className="lg:w-2/5 p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-sm">
                    {featuredBlog.category.name}
                  </span>
                  <span className="text-slate-500">
                    {formatBlogDate(featuredBlog.publishedAt ?? featuredBlog.createdAt)}
                  </span>
                </div>

                <Link href={`/blog/${featuredBlog.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-cyan-700 transition-colors tracking-tight leading-tight">
                    {featuredBlog.title}
                  </h2>
                </Link>

                <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3">
                  {featuredBlog.excerpt}
                </p>

                <div className="mt-auto pt-8 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
                      {getInitials(featuredBlog.authorName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {getAuthorName(featuredBlog.authorName)}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                        {getAuthorRole(featuredBlog.authorRole)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredBlog.slug}`}
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

          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={categoryOpen}
                aria-controls="blog-category-combobox-list"
                className={`inline-flex w-[260px] items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors duration-300 border-b-2 -mb-[1px] md:-mb-[2px] whitespace-nowrap ${
                  activeCategory
                    ? 'border-cyan-600 text-cyan-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="truncate text-sm font-bold uppercase tracking-wider">
                  {selectedCategoryLabel}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[260px] rounded-sm border border-slate-200 p-2">
              <Input
                value={categorySearch}
                onChange={(event) => setCategorySearch(event.target.value)}
                placeholder="Search categories..."
                className="mb-2 rounded-sm border-slate-200 text-sm"
              />
              <div id="blog-category-combobox-list" role="listbox" className="max-h-64 overflow-y-auto">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id || 'all'}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCategoryOpen(false);
                      setCategorySearch('');
                    }}
                    className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeCategory === category.id
                        ? 'bg-slate-100 text-cyan-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{category.name}</span>
                    {activeCategory === category.id ? (
                      <Check className="h-4 w-4 text-cyan-700" />
                    ) : null}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {isPending && (
          <div className="flex justify-center py-12">
            <BrandLoader fullScreen={false} size="sm" />
          </div>
        )}

        {/* Blog Grid */}
        {!isPending && (
          <>
            <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <div key={post.id} className="gsap-blog-card h-full">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {blogs.length === 0 && (
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
                    setActiveCategory('');
                  }}
                  className="mt-6 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 border border-cyan-600 text-cyan-600 font-bold uppercase tracking-wider text-sm hover:bg-cyan-600 hover:text-white transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
