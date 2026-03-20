import AwardsClient from './AwardsClient';
import { JsonLd } from '@/components/shared/JsonLd';
import { getAwards } from '@/lib/api/awards.api';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/structured-data';
import type { Award } from '@/types/awards.types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description:
    "Liyana Healthcare's awards and recognition — celebrating excellence in patient care, healthcare innovation, sustainability, and clinical leadership across Ethiopia and East Africa.",
  openGraph: {
    title: 'Awards & Recognition | Liyana Healthcare',
    description:
      'Celebrating excellence in healthcare — our awards and recognition.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/awards`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/awards`,
  },
};

export default async function AwardsPage() {
  let initialAwards: Award[] = [];
  let initialTotal = 0;
  let categories: string[] = [];

  try {
    const res = await getAwards({ perPage: 12 });
    initialAwards = res.data;
    initialTotal = res.total;

    const allRes = await getAwards({ perPage: 100 });
    categories = Array.from(
      new Set(
        allRes.data
          .map((award) => award.category)
          .filter((category): category is string => Boolean(category))
      )
    ).sort((a, b) => a.localeCompare(b));
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'Awards',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/awards`,
    },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <AwardsClient
        initialAwards={initialAwards}
        initialTotal={initialTotal}
        categories={categories}
      />
    </>
  );
}
