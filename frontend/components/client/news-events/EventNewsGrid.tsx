'use client';

import { filterNewsEvents } from '@/app/news-events/actions';
import { SectionHeading } from '@/components/shared/sectionHeading';
import type { NewsEvent } from '@/types/news-events.types';
import gsap from 'gsap';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { EventNewsCard } from './EventNewsCard';

interface EventNewsGridProps {
  items?: NewsEvent[];
}

export function EventNewsPageGrid({ items = [] }: EventNewsGridProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'event'>('news');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<NewsEvent[]>(items);
  const [isPending, startTransition] = useTransition();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const localByType = items.filter((item) => item.type === activeTab);

    if (debouncedSearch === '') {
      setFilteredItems(localByType);
      return;
    }

    startTransition(async () => {
      const result = await filterNewsEvents({
        type: activeTab,
        search: debouncedSearch || undefined,
      });

      if (result.length > 0) {
        setFilteredItems(result);
        return;
      }

      const localFiltered = localByType.filter((item) => {
        const text = [
          item.title,
          item.summary,
          item.location ?? '',
          item.type,
          item.date,
        ]
          .join(' ')
          .toLowerCase();
        return text.includes(debouncedSearch.toLowerCase());
      });
      setFilteredItems(localFiltered);
    });
  }, [activeTab, debouncedSearch, items]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.news-events-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [filteredItems]);

  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
        <header className="mb-12 border-b border-slate-200 pb-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-cyan-600" />
            <span className="text-sm font-bold uppercase tracking-widest text-cyan-700">
              Newsroom
            </span>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <SectionHeading
                variant="large"
                align="left"
                weight="bold"
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-600 mb-6"
              >
                {' '}
                News & Events
              </SectionHeading>
              <p className="text-lg leading-relaxed text-slate-600">
                Official announcements, company updates, and key event
                highlights.
              </p>
            </div>

            <div className="relative w-full max-w-sm lg:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search archive..."
                className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-sm focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 focus:bg-white transition-all placeholder:text-slate-400 shadow-sm"
              />
              {searchInput ? (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex items-end gap-8">
            {(['news', 'event'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-cyan-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'news' ? 'News' : 'Events'}
                {activeTab === tab ? (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-600" />
                ) : null}
              </button>
            ))}
          </div>
        </header>

        {isPending ? (
          <div className="py-2 text-sm text-slate-500">Searching...</div>
        ) : null}

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            No records found.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item) => (
              <div key={item.id} className="news-events-card">
                <EventNewsCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
