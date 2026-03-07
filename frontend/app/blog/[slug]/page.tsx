'use client';

import BlogCard from '@/components/client/blog/BlockCard';
import { blogPosts, getInitials } from '@/data/blogs';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Linkedin,
  Share2,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useLayoutEffect, useRef } from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  const post = blogPosts.find((p) => p.slug === slug);
  const articleRef = useRef<HTMLElement>(null);

  // Get 3 related posts (excluding current, sorted by latest)

  useLayoutEffect(() => {
    if (!slug) return;
    const ctx = gsap.context(() => {
      gsap.from('.gsap-article-element', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, articleRef);
    return () => ctx.revert();
  }, [slug]);

  if (!post) {
    notFound();
  }

  const relatedPosts = [...blogPosts]
    .filter((p) => p.id !== post.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white selection:bg-cyan-100 selection:text-cyan-900 pt-5 pb-24">
      {/* Top Navigation */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-700 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={16} /> Back to Insights
          </Link>
        </div>
      </div>

      <article ref={articleRef} className="pt-16">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <div className="gsap-article-element inline-block bg-slate-100 text-slate-800 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest mb-8 border border-slate-200">
            {post.category}
          </div>

          <h1 className="gsap-article-element text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-10">
            {post.title}
          </h1>

          <div className="gsap-article-element flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
                {getInitials(post.author.name)}
              </div>
              <div className="text-left">
                <span className="block text-slate-900">{post.author.name}</span>
                <span className="text-xs">{post.author.role}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-cyan-600" /> {post.date}
            </div>
            <div className="w-px h-8 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-600" /> {post.readTime}
            </div>
          </div>
        </header>

        {/* Article Hero Image */}
        <div className="gsap-article-element max-w-6xl mx-auto px-6 mb-20">
          <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content & Sidebar Layout */}
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative">
          {/* Sticky Social Share (Desktop) */}
          <aside className="hidden md:flex flex-col gap-4 sticky top-32 h-fit">
            <span
              className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"
              style={{ writingMode: 'vertical-rl' }}
            >
              Share
            </span>
            <div className="h-12 w-px bg-slate-200 mx-auto" />
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-slate-50 text-slate-500 hover:bg-[#0A66C2] hover:text-white transition-colors border border-slate-200 hover:border-transparent">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-slate-50 text-slate-500 hover:bg-black hover:text-white transition-colors border border-slate-200 hover:border-transparent">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-slate-50 text-slate-500 hover:bg-cyan-600 hover:text-white transition-colors border border-slate-200 hover:border-transparent">
              <Share2 size={18} />
            </button>
          </aside>

          {/* Main Content Body */}
          <div className="gsap-article-element flex-1 min-w-0">
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-12 border-l-4 border-cyan-600 pl-6">
              {post.excerpt}
            </p>

            <div
              className="prose prose-slate prose-lg md:prose-xl max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-p:leading-relaxed prose-p:text-slate-700
                prose-a:text-cyan-700 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-cyan-600 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:text-slate-700 prose-blockquote:font-medium prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="max-w-7xl mx-auto px-6 mt-32 pt-20 border-t border-slate-200">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            Latest Insights
          </h3>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 uppercase tracking-wider transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.id} post={relatedPost} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 uppercase tracking-wider transition-colors"
          >
            View All Articles <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
