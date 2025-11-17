'use client';

import AnimatedStats from '@/components/client/home/AnimatedStats';
import HeroBanner from '@/components/client/home/HeroBanner';
import NewsEventsPreview from '@/components/client/home/NewsEventsPreview';
import LiyanaSummary from '@/components/client/home/ServicePreview';
import { TestimonialSlider } from '@/components/client/home/TestimonialsSlider';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <LiyanaSummary />
      <AnimatedStats />
      <NewsEventsPreview />
      <TestimonialSlider />
    </div>
  );
}
