import { TestimonialForm } from '@/components/client/testimonials/TestimonialForm';
import { TestimonialGrid } from '@/components/client/testimonials/TestimonialGrid';
import { mockTestimonials } from '@/data/testimonials';
import type { Testimonial } from '@/types/testimonial.types';

export const revalidate = 600;

const approvedTestimonials: Testimonial[] = mockTestimonials
  .filter((testimonial) => testimonial.isApproved)
  .map((testimonial) => ({
    ...testimonial,
    createdAt: '',
    updatedAt: '',
  }));

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 2. Grid shows All Approved */}
      <TestimonialGrid testimonials={approvedTestimonials} />

      {/* 3. Input Form for new submissions */}
      <TestimonialForm />
    </main>
  );
}
