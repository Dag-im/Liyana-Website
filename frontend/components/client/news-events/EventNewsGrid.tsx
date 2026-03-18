'use client';

import gsap from 'gsap';
import type { NewsEvent } from '@/types/news-events.types';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EventNewsCard } from './EventNewsCard';

interface EventNewsGridProps {
  items?: NewsEvent[];
}

export function EventNewsPageGrid({ items = [] }: EventNewsGridProps) {
  const [filter, setFilter] = useState<'all' | 'news' | 'event'>('all');
  const contentRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === 'all' ? items : items.filter((item) => item.type === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.grid-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-12">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-4 gap-4">
        {/* Filters */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          {(['all', 'news', 'event'] as const).map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`
                px-6 py-2 text-sm font-semibold rounded-md transition-all
                ${
                  filter === btn
                    ? 'bg-white text-cyan-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {btn === 'all'
                ? 'View All'
                : btn === 'news'
                  ? 'News Only'
                  : 'Events Only'}
            </button>
          ))}
        </div>

        {/* Search Mockup (Visual Only) */}
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search archive..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div
        ref={contentRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((item) => (
          <div key={item.id} className="grid-card">
            <EventNewsCard {...item} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center border-t border-slate-100">
          <p className="text-slate-500">
            No records found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
