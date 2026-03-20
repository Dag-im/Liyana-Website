import HomePageClient from '@/app/HomePageClient';
import { getStats } from '@/lib/api/cms.api';
import { getLatestEvents, getLatestNews } from '@/lib/api/news-events.api';
import { getServiceCategories } from '@/lib/api/services.api';
import { getTestimonials } from '@/lib/api/testimonials.api';
import type { Stat } from '@/types/cms.types';
import type { NewsEvent } from '@/types/news-events.types';
import type { ServiceCategory } from '@/types/services.types';
import type { Testimonial } from '@/types/testimonial.types';
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
  let latestNews: NewsEvent[] = [];
  let latestEvents: NewsEvent[] = [];
  let sliderTestimonials: Testimonial[] = [];

  await Promise.allSettled([
    getStats().then((data) => {
      stats = data;
    }),
    getServiceCategories().then((data) => {
      categories = data;
    }),
    getLatestNews(3).then((data) => {
      latestNews = data;
    }),
    getLatestEvents(3).then((data) => {
      latestEvents = data;
    }),
    getTestimonials({ isFavorite: true, perPage: 20 }).then((res) => {
      sliderTestimonials = res.data;
    }),
  ]);

  const newsEventsItems = [...latestNews, ...latestEvents];

  return (
    <HomePageClient
      stats={stats}
      categories={categories}
      newsEventsItems={newsEventsItems}
      testimonials={sliderTestimonials}
    />
  );
}
