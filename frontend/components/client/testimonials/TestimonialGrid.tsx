'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { TestimonialCard } from './TestimonialCard';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO, HealthPlus',
    message:
      'This service has completely transformed the way we connect with patients. Highly professional and seamless!',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Founder, MedConnect',
    message:
      'The platform is intuitive, reliable, and simply outstanding. We couldn’t ask for a better experience.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'Patient Advocate',
    message:
      'Easy to use, highly responsive, and beautifully designed. It made a real difference in my journey.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'James Lee',
    role: 'Doctor, FamilyCare',
    message:
      'I recommend this platform to all my peers. It simplifies communication and increases patient satisfaction.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
];

export function TestimonialGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.testimonial-card');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section className="w-full py-20 md:py-28 px-6">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        Testimonials
      </SectionHeading>

      <div
        ref={gridRef}
        className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
      >
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
    </section>
  );
}
