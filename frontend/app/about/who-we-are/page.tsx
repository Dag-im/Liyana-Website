import LiyanaNetwork from '@/components/client/about/LiyanaNetwork';
import Timeline from '@/components/client/about/Timeline';
import WhoWeAre from '@/components/client/about/WhoWeAre';
import { JsonLd } from '@/components/shared/JsonLd';
import { getWhoWeAre } from '@/lib/api/cms.api';
import { getNetworkMeta, getNetworkTree } from '@/lib/api/network.api';
import { getTimelineItems } from '@/lib/api/timeline.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { NetworkEntity, NetworkMeta } from '@/types/network.types';
import type { TimelineItem } from '@/types/timeline.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

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

export default async function WhoWeArePage() {
  let whoWeAreContent =
    'A collective of innovators, problem solvers, and dreamers. We create impact through technology, healthcare, and sustainable solutions — empowering businesses and communities worldwide.';
  let timelineItems: TimelineItem[] = [];
  let networkTree: NetworkEntity[] = [];
  let networkMeta: NetworkMeta | undefined;

  await Promise.allSettled([
    getWhoWeAre().then((data) => {
      whoWeAreContent = data.content;
    }),
    getTimelineItems({ perPage: 100 }).then((res) => {
      timelineItems = res.data;
    }),
    getNetworkTree().then((data) => {
      networkTree = data;
    }),
    getNetworkMeta().then((data) => {
      networkMeta = data;
    }),
  ]);

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
      <WhoWeAre content={whoWeAreContent} />
      <Timeline items={timelineItems} title="Our Journey" subtitle="Milestones" />
      <LiyanaNetwork data={networkTree} meta={networkMeta} />
    </>
  );
}
