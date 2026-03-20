'use client';

import AnimatedStats from '@/components/client/home/AnimatedStats';
import HeroBanner from '@/components/client/home/HeroBanner';
import NewsEventsPreview from '@/components/client/home/NewsEventsPreview';
import LiyanaSummary from '@/components/client/home/ServicePreview';
import { TestimonialSlider } from '@/components/client/home/TestimonialsSlider';
import ApiStatusBadge from '@/components/shared/ApiStatusBadge';
import type { NewsEvent, ServiceCategory, Stat, Testimonial } from '@/types';

interface HomePageClientProps {
  stats?: Stat[];
  categories?: ServiceCategory[];
  newsEventsItems?: NewsEvent[];
  testimonials?: Testimonial[];
}

export default function Home({
  stats,
  categories: liveCategories,
  newsEventsItems = [],
  testimonials = [],
}: HomePageClientProps) {
  const categories = liveCategories ?? [];

  return (
    <div>
      <ApiStatusBadge />
      <HeroBanner categories={categories} />
      <LiyanaSummary categories={categories} />
      <AnimatedStats stats={stats} />
      <NewsEventsPreview items={newsEventsItems} />
      <TestimonialSlider testimonials={testimonials} />
    </div>
  );
}
