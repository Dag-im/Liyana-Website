'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { EventNewsCard, EventNewsCardProps } from './EventNewsCard';

interface EventNewsPageGridProps {
  items: EventNewsCardProps[];
}

export function EventNewsPageGrid({ items }: EventNewsPageGridProps) {
  const [filter, setFilter] = useState<'all' | 'news' | 'event'>('all');
  const contentRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === 'all' ? items : items.filter((item) => item.type === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [filter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-14 space-y-14">
      {/* Header */}
      <div className="text-center space-y-4">
        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore the latest insights, announcements, and milestones from our
          organization. Stay informed with key developments and upcoming events.
        </p>

        <div className="w-12 h-1 bg-cyan-600 rounded-full mx-auto opacity-70" />
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 md:gap-5">
        {(['all', 'news', 'event'] as const).map((btn) => {
          const active = filter === btn;

          return (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-700 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200'
              }`}
            >
              {btn === 'all' ? 'All' : btn === 'news' ? 'News' : 'Events'}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div
        ref={contentRef}
        className="
          grid gap-10
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        "
      >
        {filtered.map((item) => (
          <div key={item.id} className="page-card">
            <EventNewsCard {...item} />
          </div>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            No results found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
