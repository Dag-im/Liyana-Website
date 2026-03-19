'use client';

import AnimatedStats from '@/components/client/home/AnimatedStats';
import HeroBanner from '@/components/client/home/HeroBanner';
import NewsEventsPreview from '@/components/client/home/NewsEventsPreview';
import LiyanaSummary from '@/components/client/home/ServicePreview';
import { TestimonialSlider } from '@/components/client/home/TestimonialsSlider';
import ApiStatusBadge from '@/components/shared/ApiStatusBadge';
import { newsEventsData } from '@/app/news-events/data';
import { mockTestimonials } from '@/data/testimonials';
import type { NewsEvent, ServiceCategory, Stat, Testimonial } from '@/types';

function mapNewsEvent(item: (typeof newsEventsData)[number]): NewsEvent {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    date: item.date,
    location: item.location ?? null,
    summary: item.summary,
    content: item.content,
    keyHighlights: item.keyHighlights ?? null,
    mainImage: item.mainImage,
    image1: item.image1 ?? '',
    image2: item.image2 ?? '',
    status: 'PUBLISHED',
    publishedAt: item.date,
    createdById: 'mock-author',
    createdByName: 'Liyana Healthcare',
    createdAt: item.date,
    updatedAt: item.date,
  };
}

function mapTestimonial(item: (typeof mockTestimonials)[number]): Testimonial {
  return {
    ...item,
    createdAt: '',
    updatedAt: '',
  };
}

interface HomePageClientProps {
  stats?: Stat[];
  categories?: ServiceCategory[];
}

export default function Home({
  stats,
  categories: liveCategories,
}: HomePageClientProps) {
  const categories = liveCategories ?? [];
  const items = newsEventsData.map(mapNewsEvent);
  const testimonials = mockTestimonials
    .filter((testimonial) => testimonial.isApproved && testimonial.isFavorite)
    .map(mapTestimonial);

  return (
    <div>
      <ApiStatusBadge />
      <HeroBanner categories={categories} />
      <LiyanaSummary categories={categories} />
      <AnimatedStats stats={stats} />
      <NewsEventsPreview items={items} />
      <TestimonialSlider testimonials={testimonials} />
    </div>
  );
}
