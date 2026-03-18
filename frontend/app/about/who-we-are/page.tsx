import LiyanaOrgGraph, {
  DATA as mockGraphData,
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
    achievement: null,
    category: 'milestone',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    year: '2017',
    title: 'First Major Award',
    description:
      'Received the Innovation Award for groundbreaking work in AI development.',
    location: null,
    achievement: 'Innovation Award 2017',
    category: 'achievement',
    image: null,
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    year: '2019',
    title: 'Global Expansion',
    description:
      'Opened new offices in London and Tokyo to serve our growing international client base.',
    location: 'London, UK & Tokyo, Japan',
    achievement: null,
    category: 'expansion',
    image: 'https://images.unsplash.com/photo-1503428593583-cb1b6d01115f',
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    year: '2021',
    title: 'AI Platform Launch',
    description:
      'Launched our flagship AI platform, transforming how businesses leverage data.',
    category: 'innovation',
    location: null,
    achievement: 'TechCrunch Disrupt Winner',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    year: '2023',
    title: 'Strategic Partnership',
    description:
      'Formed a strategic partnership with leading tech giants to enhance our ecosystem.',
    location: 'New York, NY',
    achievement: null,
    category: 'milestone',
    image: null,
    sortOrder: 5,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    year: '2025',
    title: 'Sustainability Initiative',
    description:
      'Introduced a comprehensive sustainability program to reduce our carbon footprint.',
    achievement: 'Green Tech Certification',
    location: null,
    category: 'achievement',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c7983',
    sortOrder: 6,
    createdAt: '',
    updatedAt: '',
  },
];

const page = () => {
  return (
    <>
      <WhoWeAreLuxury
        content="A collective of innovators, problem solvers, and dreamers. We create impact through technology, healthcare, and sustainable solutions — empowering businesses and communities worldwide."
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
      />
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
