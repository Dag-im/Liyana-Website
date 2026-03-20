import { TestimonialForm } from '@/components/client/testimonials/TestimonialForm';
import { TestimonialGrid } from '@/components/client/testimonials/TestimonialGrid';
import { JsonLd } from '@/components/shared/JsonLd';
import {
  getTestimonialsPublic,
  submitTestimonial,
} from '@/lib/api/testimonials.api';
import {
  breadcrumbSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type { Testimonial } from '@/types/testimonial.types';
import type { Metadata } from 'next';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Read what healthcare professionals and organizations say about Liyana Healthcare — trusted by leading institutions across Ethiopia and East Africa for clinical excellence and innovation.',
  openGraph: {
    title: 'Testimonials | Liyana Healthcare',
    description:
      'Trusted by leading healthcare organizations across Ethiopia and East Africa.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/testimonials`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/testimonials`,
  },
};

export default async function TestimonialsPage() {
  let initialTestimonials: Testimonial[] = [];
  let initialNextCursor: string | null = null;
  let initialHasMore = false;

  try {
    const res = await getTestimonialsPublic({ limit: 8 });
    initialTestimonials = res.data;
    initialNextCursor = res.nextCursor;
    initialHasMore = res.hasMore;
  } catch {}

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    {
      name: 'Testimonials',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/testimonials`,
    },
  ]);

  async function handleSubmit(data: {
    name: string;
    role: string;
    company: string;
    message: string;
  }) {
    'use server';
    await submitTestimonial(data);
  }

  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumb]} />
      <TestimonialGrid
        initialTestimonials={initialTestimonials}
        initialNextCursor={initialNextCursor}
        initialHasMore={initialHasMore}
      />
      <TestimonialForm onSubmit={handleSubmit} />
    </>
  );
}
