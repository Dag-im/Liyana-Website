'use client';

import { EventNewsPageGrid } from '@/components/client/news-events/EventNewsGrid';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { newsEventsData } from './data';

export default function NewsEventsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Corporate Header Block */}

        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          News & Events
        </SectionHeading>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed text-center align-middle">
          Stay up to date with the latest developments, strategic announcements,
          and upcoming conferences from our organization.
        </p>
      </div>

      {/* Grid Component */}
      <EventNewsPageGrid items={newsEventsData} />
    </div>
  );
}
