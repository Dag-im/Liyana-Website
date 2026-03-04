'use client';

import { newsEventsData } from '@/app/news-events/data';
import { EventNewsTabs } from '../news-events/EventNewsTabs';

const NewsEventsPreview = () => {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Tabs Component */}
        <EventNewsTabs items={newsEventsData} />
      </div>
    </section>
  );
};

export default NewsEventsPreview;
