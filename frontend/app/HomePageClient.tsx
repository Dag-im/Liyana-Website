'use client';

import AnimatedStats from '@/components/client/home/AnimatedStats';
import HeroBanner from '@/components/client/home/HeroBanner';
import NewsEventsPreview from '@/components/client/home/NewsEventsPreview';
import LiyanaSummary from '@/components/client/home/ServicePreview';
import { TestimonialSlider } from '@/components/client/home/TestimonialsSlider';
import ApiStatusBadge from '@/components/shared/ApiStatusBadge';
import { newsEventsData } from '@/app/news-events/data';
import {
  SERVICES_DATA,
  type Division as LocalDivision,
  type Doctor as LocalDoctor,
  type ServiceCategory as LocalServiceCategory,
} from '@/data/services';
import { mockTestimonials } from '@/data/testimonials';
import type {
  Division,
  NewsEvent,
  ServiceCategory,
  Testimonial,
} from '@/types';

function mapDoctor(doctor: LocalDoctor, divisionId: string) {
  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    image: doctor.image,
    availability: doctor.availability,
    divisionId,
  };
}

function mapDivision(division: LocalDivision, serviceCategoryId: string): Division {
  return {
    id: division.id,
    slug: division.slug,
    name: division.name,
    shortName: division.shortName,
    location: division.location ?? null,
    overview: division.overview,
    logo: division.logo ?? null,
    description: division.description,
    groupPhoto: division.groupPhoto ?? null,
    isActive: true,
    serviceCategoryId,
    divisionCategoryId: division.type,
    divisionCategory: {
      id: division.type,
      name: division.type,
      label: division.type,
      description: null,
    },
    images: division.images.map((path, index) => ({
      id: `${division.id}-image-${index}`,
      path,
      sortOrder: index,
    })),
    coreServices: division.coreServices.map((name, index) => ({
      id: `${division.id}-service-${index}`,
      name,
      sortOrder: index,
    })),
    stats: (division.stats ?? []).map((stat, index) => ({
      id: `${division.id}-stat-${index}`,
      label: stat.label,
      value: stat.value,
      sortOrder: index,
    })),
    doctors: (division.doctors ?? []).map((doctor) =>
      mapDoctor(doctor, division.id)
    ),
    contact: {
      id: `${division.id}-contact`,
      phone: division.contact.phone ?? null,
      email: division.contact.email ?? null,
      address: division.contact.address ?? null,
      googleMap: division.contact.googleMap ?? null,
    },
    createdAt: '',
    updatedAt: '',
  };
}

function mapCategory(category: LocalServiceCategory): ServiceCategory {
  return {
    id: category.id,
    title: category.title,
    tagline: category.tagline,
    heroImage: category.heroImage,
    attributes: category.attributes,
    divisions: category.divisions.map((division) =>
      mapDivision(division, category.id)
    ),
    createdAt: '',
    updatedAt: '',
  };
}

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

export default function Home() {
  const categories = SERVICES_DATA.map(mapCategory);
  const items = newsEventsData.map(mapNewsEvent);
  const testimonials = mockTestimonials
    .filter((testimonial) => testimonial.isApproved && testimonial.isFavorite)
    .map(mapTestimonial);

  return (
    <div>
      <ApiStatusBadge />
      <HeroBanner categories={categories} />
      <LiyanaSummary categories={categories} />
      <AnimatedStats />
      <NewsEventsPreview items={items} />
      <TestimonialSlider testimonials={testimonials} />
    </div>
  );
}
