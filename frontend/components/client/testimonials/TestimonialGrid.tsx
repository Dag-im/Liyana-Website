'use client';

import { getTestimonialsPublic } from '@/lib/api/testimonials.api';
import type { Testimonial } from '@/types/testimonial.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState, useTransition } from 'react';
import { TestimonialCard } from './TestimonialCard';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialGridProps {
  initialTestimonials: Testimonial[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}

export function TestimonialGrid({
  initialTestimonials,
  initialNextCursor,
  initialHasMore,
}: TestimonialGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.testimonial-card');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
        },
      }
    );
  }, [testimonials]);

  const handleLoadMore = () => {
    if (!nextCursor) return;

    startTransition(async () => {
      try {
        const res = await getTestimonialsPublic({
          cursor: nextCursor,
          limit: 8,
        });
        setTestimonials((prev) => [...prev, ...res.data]);
        setNextCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch {}
    });
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="w-full py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Client Perspectives
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Insights from our global partners and stakeholders.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="px-8 py-3 border border-[#0880b9] text-[#0880b9] font-bold uppercase tracking-wider text-sm hover:bg-[#0880b9] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
