'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import type { Testimonial } from '@/types/testimonial.types';
import { useEffect, useRef } from 'react';
import { TestimonialCard } from '../testimonials/TestimonialCard';

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
}

export function TestimonialSlider({
  testimonials = [],
}: TestimonialSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current || testimonials.length === 0) return;

    // Calculate total width of one set of cards for seamless loop
    const slider = sliderRef.current;
    const totalWidth = slider.scrollWidth / 2;

    const animation = gsap.to(slider, {
      x: `-${totalWidth}px`,
      duration: 35, // Adjust speed here
      ease: 'none',
      repeat: -1,
    });

    // Pause on hover for readability
    slider.addEventListener('mouseenter', () => animation.pause());
    slider.addEventListener('mouseleave', () => animation.play());

    return () => {
      slider.removeEventListener('mouseenter', () => animation.pause());
      slider.removeEventListener('mouseleave', () => animation.play());
      animation.kill();
    };
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  // Duplicate for seamless infinite scrolling
  const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="w-full py-20 bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <SectionHeading
          variant="large"
          align="left"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#33bde9] via-[#01649c] to-[#014f7a] mb-6"
        >
          What Our Clients Say
        </SectionHeading>
        <h3 className="text-2xl font-semibold text-slate-800">
          Trusted by Industry Leaders
        </h3>
      </div>

      <div className="relative w-full">
        {/* Left/Right Fade masks for smooth edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div ref={sliderRef} className="flex gap-6 w-max px-6">
          {loopTestimonials.map((t, index) => (
            <div
              key={`${t.id}-${index}`}
              className="flex-shrink-0 w-[350px] lg:w-[400px]"
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
