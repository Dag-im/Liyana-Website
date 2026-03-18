'use client';

import type { NewsEvent } from '@/types/news-events.types';
import { EventNewsTabs } from '../news-events/EventNewsTabs';

interface NewsEventsPreviewProps {
  items?: NewsEvent[];
}

const NewsEventsPreview = ({ items = [] }: NewsEventsPreviewProps) => {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Tabs Component */}
        <EventNewsTabs items={items} />
      </div>
    </section>
  );
};

export default NewsEventsPreview;
