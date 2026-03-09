'use client';

import AnimatedStats from '@/components/client/home/AnimatedStats';
import HeroBanner from '@/components/client/home/HeroBanner';
import NewsEventsPreview from '@/components/client/home/NewsEventsPreview';
import LiyanaSummary from '@/components/client/home/ServicePreview';
import { TestimonialSlider } from '@/components/client/home/TestimonialsSlider';
import ApiStatusBadge from '@/components/shared/ApiStatusBadge';
import { mockTestimonials } from '@/data/testimonials';

export default function Home() {
  return (
    <div>
      <ApiStatusBadge />
      <HeroBanner />
      <LiyanaSummary />
      <AnimatedStats />
      <NewsEventsPreview />
      <TestimonialSlider testimonials={mockTestimonials} />
    </div>
  );
}
