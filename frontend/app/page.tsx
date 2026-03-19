import HomePageClient from '@/app/HomePageClient';
import { getStats } from '@/lib/api/cms.api';
import { getServiceCategories } from '@/lib/api/services.api';
import type { Stat } from '@/types/cms.types';
import type { ServiceCategory } from '@/types/services.types';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: {
    absolute: 'Liyana Healthcare | Excellence in Patient-Centered Care',
  },
  description:
    'Liyana Healthcare delivers subspecialized medical care, advanced diagnostics, and integrated healthcare solutions across Ethiopia and East Africa. Committed to clinical excellence, innovation, and compassionate patient care.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  openGraph: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function Home() {
  let stats: Stat[] = [];
  let categories: ServiceCategory[] = [];

  await Promise.allSettled([
    getStats().then((data) => {
      stats = data;
    }),
    getServiceCategories().then((data) => {
      categories = data;
    }),
  ]);

  return <HomePageClient stats={stats} categories={categories} />;
}
