'use client';

import { EventNewsPageGrid } from '@/components/client/news-events/EventNewsGrid';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { newsEventsData } from './data';

export default function NewsEventsPage() {
  return (
    <div className="max-w-7xl mx-auto pt-28 px-6">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        News & Events
      </SectionHeading>
      <EventNewsPageGrid items={newsEventsData} />
    </div>
  );
}
