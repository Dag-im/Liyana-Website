'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

interface WhoWeAreProps {
  content?: string;
  image?: string;
}

export default function WhoWeAreLuxury({
  content = 'A collective of innovators, problem solvers, and dreamers. We create impact through technology, healthcare, and sustainable solutions — empowering businesses and communities worldwide.',
  image = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
}: WhoWeAreProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from('.gsap-who-we-are', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-6 pt-8 pb-24 md:pb-32 bg-white selection:bg-cyan-100 selection:text-cyan-900 border-b border-slate-200"
    >
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* LEFT: Text */}
        <div className="flex-1 text-left z-10 w-full">
          <div className="gsap-who-we-are flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-cyan-600" />
            <span className="text-cyan-700 font-bold uppercase tracking-widest text-sm">
              Corporate Identity
            </span>
          </div>

          <h2 className="gsap-who-we-are text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-8 tracking-tight">
            Who We Are
          </h2>

          <p className="gsap-who-we-are text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
            {content}
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="gsap-who-we-are flex-1 relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-slate-100 border border-slate-200">
          <Image
            src={image}
            alt="Corporate Team"
            fill
            className="object-cover"
          />
          {/* Subtle overlay for contrast */}
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
