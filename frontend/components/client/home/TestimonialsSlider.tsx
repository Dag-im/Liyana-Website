'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { TestimonialCard } from '../testimonials/TestimonialCard';

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO, HealthPlus',
    message:
      'This service has completely transformed the way we connect with patients. Highly professional and seamless!',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Founder, MedConnect',
    message:
      'The platform is intuitive, reliable, and simply outstanding. We couldn’t ask for a better experience.',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'Patient Advocate',
    message:
      'Easy to use, highly responsive, and beautifully designed. It made a real difference in my journey.',
  },
  {
    id: '4',
    name: 'James Lee',
    role: 'Doctor, FamilyCare',
    message:
      'I recommend this platform to all my peers. It simplifies communication and increases patient satisfaction.',
  },
];

export function TestimonialSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const totalWidth = sliderRef.current.scrollWidth / 2;

    gsap.to(sliderRef.current, {
      x: `-${totalWidth}px`,
      duration: 40,
      ease: 'linear',
      repeat: -1,
    });
  }, []);

  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="w-full py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        What People are saying
      </SectionHeading>

      <div ref={sliderRef} className="flex gap-6">
        {loopTestimonials.map((t, index) => (
          <motion.div
            key={index}
            className="testimonial-card flex-shrink-0 w-[300px] sm:w-[320px] md:w-[340px] lg:w-[360px]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <TestimonialCard {...t} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
