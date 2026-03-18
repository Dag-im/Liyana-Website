'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import type { NewsEvent } from '@/types/news-events.types';
import { useEffect, useRef, useState } from 'react';
import { EventNewsCard } from './EventNewsCard';

interface EventNewsTabsProps {
  items?: NewsEvent[];
}

export function EventNewsTabs({ items = [] }: EventNewsTabsProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'event'>('news');
  const containerRef = useRef<HTMLDivElement>(null);

  const news = items.filter((item) => item.type === 'news');
  const events = items.filter((item) => item.type === 'event');
  const displayItems = activeTab === 'news' ? news : events;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tab-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-200 pb-4">
          <div>
            <SectionHeading
              variant="large"
              align="left"
              weight="bold"
              className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
            >
              Latest Insights
            </SectionHeading>
            <p className="text-slate-500">
              Stay informed with our latest announcements and upcoming schedule.
            </p>
          </div>

          {/* Corporate Tabs */}
          <div className="flex gap-8">
            {(['news', 'event'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-4 text-sm font-bold uppercase tracking-wider transition-all relative
                  ${activeTab === tab ? 'text-cyan-700' : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                {tab === 'news' ? 'Company News' : 'Upcoming Events'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-cyan-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayItems.slice(0, 3).map((item) => (
            <div key={item.id} className="tab-card h-full">
              <EventNewsCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
