import LiyanaOrgGraph, {
  mockGraphData,
} from '@/components/client/about/LiyanaNetwork';
import Timeline, { TimelineItem } from '@/components/client/about/Timeline';
import WhoWeAreLuxury from '@/components/client/about/WhoWeAre';

const items: TimelineItem[] = [
  {
    id: '1',
    year: '2015',
    title: 'Company Founded',
    description:
      'Our journey began with a small team dedicated to revolutionizing technology solutions.',
    location: 'San Francisco, CA',
    category: 'milestone',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  },
  {
    id: '2',
    year: '2017',
    title: 'First Major Award',
    description:
      'Received the Innovation Award for groundbreaking work in AI development.',
    achievement: 'Innovation Award 2017',
    category: 'achievement',
  },
  {
    id: '3',
    year: '2019',
    title: 'Global Expansion',
    description:
      'Opened new offices in London and Tokyo to serve our growing international client base.',
    location: 'London, UK & Tokyo, Japan',
    category: 'expansion',
    image: 'https://images.unsplash.com/photo-1503428593583-cb1b6d01115f',
  },
  {
    id: '4',
    year: '2021',
    title: 'AI Platform Launch',
    description:
      'Launched our flagship AI platform, transforming how businesses leverage data.',
    category: 'innovation',
    achievement: 'TechCrunch Disrupt Winner',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  },
  {
    id: '5',
    year: '2023',
    title: 'Strategic Partnership',
    description:
      'Formed a strategic partnership with leading tech giants to enhance our ecosystem.',
    location: 'New York, NY',
    category: 'milestone',
  },
  {
    id: '6',
    year: '2025',
    title: 'Sustainability Initiative',
    description:
      'Introduced a comprehensive sustainability program to reduce our carbon footprint.',
    achievement: 'Green Tech Certification',
    category: 'achievement',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c7983',
  },
];

const page = () => {
  return (
    <>
      <WhoWeAreLuxury />
      <Timeline
        items={items}
        title="Our Journey"
        subtitle="Key milestones, achievements & expansions that shaped who we are today."
      />
      <LiyanaOrgGraph data={mockGraphData} />
    </>
  );
};

export default page;
