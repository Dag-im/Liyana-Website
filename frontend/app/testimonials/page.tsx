import { TestimonialForm } from '@/components/client/testimonials/TestimonialForm';
import { TestimonialGrid } from '@/components/client/testimonials/TestimonialGrid';
import { mockTestimonials } from '@/data/testimonials';

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 2. Grid shows All Approved */}
      <TestimonialGrid testimonials={mockTestimonials} />

      {/* 3. Input Form for new submissions */}
      <TestimonialForm />
    </main>
  );
}
