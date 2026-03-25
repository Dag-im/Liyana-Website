'use client';

import { EventNewsPageGrid } from '@/components/client/news-events/EventNewsGrid';
import { SectionHeading } from '@/components/shared/sectionHeading';
import type { NewsEvent } from '@/types/news-events.types';

interface NewsEventsPageClientProps {
  items?: NewsEvent[];
}

export default function NewsEventsPageClient({
  items = [],
}: NewsEventsPageClientProps) {
  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white border-b border-slate-200 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Identity Strip */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-[#0880b9]" />
            <span className="text-[#01649c] font-bold uppercase tracking-widest text-sm">
              Newsroom
            </span>
          </div>

          {/* Title */}
          <SectionHeading
            variant="large"
            align="left"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#01649c] via-[#33bde9] to-[#0880b9] mb-6"
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
