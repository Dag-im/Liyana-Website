import { newsEventsData } from '@/app/news-events/data';
import { SectionHeading } from '@/components/shared/sectionHeading';
import { EventNewsTabs } from '../news-events/EventNewsTabs';

const NewsEventsPreview = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          News & Events
        </SectionHeading>
        <EventNewsTabs items={newsEventsData} />
      </div>
    </div>
  );
};

export default NewsEventsPreview;
