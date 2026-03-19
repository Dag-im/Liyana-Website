import LiyanaNetwork, { DATA as mockGraphData } from '@/components/client/about/LiyanaNetwork';
import Timeline, { TimelineItem } from '@/components/client/about/Timeline';
import WhoWeAre from '@/components/client/about/WhoWeAre';
import { JsonLd } from '@/components/shared/JsonLd';
import { getWhoWeAre } from '@/lib/api/cms.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { Metadata } from 'next';

export const revalidate = 86400;

const CMS_FETCH_TIMEOUT_MS = 3000;

async function withTimeout<T>(promise: Promise<T>, ms = CMS_FETCH_TIMEOUT_MS): Promise<T> {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('CMS fetch timeout')), ms);
    }),
  ]);
}

export const metadata: Metadata = {
  title: 'Who We Are',
  description:
    'Learn about Liyana Healthcare - our story, our people, and our journey building a vertically integrated healthcare ecosystem across Ethiopia and East Africa.',
  openGraph: {
    title: 'Who We Are | Liyana Healthcare',
    description:
      'Our story, our people, and our journey building healthcare excellence across East Africa.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/who-we-are`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/who-we-are`,
  },
};

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

export default async function WhoWeArePage() {
  let whoWeAre = {
    content:
      'A collective of innovators, problem solvers, and dreamers. We create impact through technology, healthcare, and sustainable solutions - empowering businesses and communities worldwide.',
    updatedAt: new Date().toISOString(),
  };

  try {
    whoWeAre = await withTimeout(getWhoWeAre());
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'Who We Are',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/who-we-are`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <WhoWeAre content={whoWeAre.content} />
      <Timeline
        items={items}
        title="Our Journey"
        subtitle="Key milestones, achievements & expansions that shaped who we are today."
      />
      <LiyanaNetwork data={mockGraphData} />
    </>
  );
}
