'use client';

import { EventNewsPageGrid } from '@/components/client/news-events/EventNewsGrid';
import { SectionHeading } from '@/components/shared/sectionHeading';
import type { NewsEvent } from '@/types/news-events.types';
import { newsEventsData } from './data';

const items: NewsEvent[] = newsEventsData.map((item) => ({
  id: item.id,
  type: item.type,
  title: item.title,
  date: item.date,
  location: item.location ?? null,
  summary: item.summary,
  content: item.content,
  keyHighlights: item.keyHighlights ?? null,
  mainImage: item.mainImage,
  image1: item.image1 ?? '',
  image2: item.image2 ?? '',
  status: 'PUBLISHED',
  publishedAt: item.date,
  createdById: 'mock-author',
  createdByName: 'Liyana Healthcare',
  createdAt: item.date,
  updatedAt: item.date,
}));

export default function NewsEventsPage() {
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white border-b border-slate-200 pt-10 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Identity Strip */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-cyan-600" />
            <span className="text-cyan-700 font-bold uppercase tracking-widest text-sm">
              Newsroom
            </span>
          </div>

          {/* Title */}
          <SectionHeading
            variant="large"
            align="left"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-600 mb-6"
          >
            News & Events
          </SectionHeading>

          {/* Description */}
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Official announcements, corporate updates, and upcoming events from
            across our organization.
          </p>
        </div>
      </header>

      {/* Grid Component */}
      <EventNewsPageGrid items={items} />
    </div>
  );
}
