'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { EventNewsCard, EventNewsCardProps } from './EventNewsCard';

interface EventNewsTabsProps {
  items: EventNewsCardProps[];
}

export function EventNewsTabs({ items }: EventNewsTabsProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'event'>('news');
  const contentRef = useRef<HTMLDivElement>(null);

  const news = items.filter((item) => item.type === 'news');
  const events = items.filter((item) => item.type === 'event');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tab-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center gap-10 mb-10 border-b border-gray-200 dark:border-neutral-800 pb-3">
        {(['news', 'event'] as const).map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative px-2 pb-2 text-lg font-medium uppercase
                transition-colors tracking-wide
                ${
                  active
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }
              `}
            >
              {tab === 'news' ? 'News' : 'Events'}

              {active && (
                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 bottom-0
                    h-[3px] w-8 rounded-full bg-cyan-500
                    transition-all
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="
          grid gap-8
          grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        "
      >
        {(activeTab === 'news' ? news : events).map((item) => (
          <div key={item.id} className="tab-item">
            <EventNewsCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
