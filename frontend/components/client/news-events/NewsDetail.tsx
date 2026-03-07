'use client';

import gsap from 'gsap';
import { ArrowLeft, Clock, Linkedin, Printer, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface NewsDetailProps {
  title: string;
  date: string;
  content: string[];
  mainImage: string;
  keyHighlights: string[];
  image1?: string;
  image2?: string;
}

export function NewsDetail({
  title,
  date,
  content,
  mainImage,
  keyHighlights,
  image1,
  image2,
}: NewsDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-in', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={containerRef} className="bg-white min-h-screen pt-14 pb-20">
      {/* Breadcrumb Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 fade-in">
        <Link
          href="/news-events"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-700 font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Back to Newsroom
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Header + Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Article Header */}
          <header className="border-b border-slate-200 pb-8 fade-in">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                <Clock size={14} /> {date}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
          </header>

          {/* Main Image */}
          <div className="fade-in relative w-full h-[400px] bg-slate-100 rounded-sm overflow-hidden">
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Body Text */}
          <div className="fade-in prose prose-slate prose-lg max-w-none text-slate-700">
            {content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Additional Images Grid */}
          {(image1 || image2) && (
            <div className="fade-in grid grid-cols-2 gap-4 mt-8">
              {image1 && (
                <div className="relative h-56 w-full rounded-sm overflow-hidden">
                  <Image
                    src={image1}
                    alt="Detail 1"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {image2 && (
                <div className="relative h-56 w-full rounded-sm overflow-hidden">
                  <Image
                    src={image2}
                    alt="Detail 2"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-10 fade-in">
          {/* Key Highlights Box */}
          <div className="bg-slate-50 border-t-4 border-cyan-600 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Executive Summary
            </h3>
            <ul className="space-y-4">
              {keyHighlights.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="min-w-[6px] h-[6px] rounded-full bg-cyan-500 mt-2" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Share Tools */}
          <div className="border-t border-slate-200 pt-8">
            <p className="text-xs font-bold text-slate-400 uppercase mb-4">
              Share this article
            </p>
            <div className="flex gap-4">
              <button className="p-2 border border-slate-200 text-slate-600 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all rounded-sm">
                <Linkedin size={20} />
              </button>
              <button className="p-2 border border-slate-200 text-slate-600 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all rounded-sm">
                <Twitter size={20} />
              </button>
              <button className="p-2 border border-slate-200 text-slate-600 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all rounded-sm">
                <Printer size={20} />
              </button>
            </div>
          </div>

          {/* Contact Boilerplate */}
          <div className="bg-slate-900 text-white p-6 rounded-sm">
            <h4 className="font-bold text-lg mb-2">Media Contact</h4>
            <p className="text-sm text-slate-400 mb-4">
              For press inquiries, please contact our corporate communications
              team.
            </p>
            <a
              href="mailto:press@company.com"
              className="text-sm font-bold text-cyan-400 hover:underline"
            >
              press@company.com
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
