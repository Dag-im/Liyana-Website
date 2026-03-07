'use client';

import { Testimonial } from '@/data/testimonials';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { TestimonialCard } from './TestimonialCard';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialGridProps {
  testimonials: Testimonial[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter: Only Approved
  const approvedTestimonials = testimonials.filter((t) => t.isApproved);

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
  }, []);

  if (approvedTestimonials.length === 0) return null;

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
          {approvedTestimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
