'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { SERVICES_DATA } from '@/data/services';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  Factory,
  GraduationCap,
  Hospital,
  Pill,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

// ---------- ICON MAP ----------
const iconMap: Record<string, React.ReactNode> = {
  'advanced-services': <Hospital className="h-8 w-8 text-cyan-700" />,
  'education-research': <GraduationCap className="h-8 w-8 text-cyan-700" />,
  'drugs-supplies-import': <Pill className="h-8 w-8 text-cyan-700" />,
  'product-manufacturing': <Factory className="h-8 w-8 text-cyan-700" />,
};

// ---------- COMPONENT ----------
export default function LiyanaSummary() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Register plugin safely
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.corporate-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'all', // Cleans up inline styles after animation
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="px-6 pb-24 border-b border-slate-200 selection:bg-cyan-100 selection:text-cyan-900"
    >
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col items-center">
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          Products & Services
        </SectionHeading>
        <p className="max-w-2xl text-center text-slate-600 text-lg">
          Delivering excellence across multiple sectors through our specialized
          divisions.
        </p>
      </div>

      {/* GRID SECTION */}
      {/* Using lg:grid-cols-2 so cards have plenty of space to breathe. Adjust to lg:grid-cols-4 if you want them smaller/tighter. */}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
        {SERVICES_DATA.map((item) => (
          <div
            key={item.id}
            className="corporate-card group relative flex flex-col bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Header: Icon & Title */}
            <div className="mb-6">
              <div className="mb-5 inline-flex p-3 bg-slate-50 border border-slate-100 rounded-sm">
                {iconMap[item.id]}
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
            </div>

            {/* Accent Divider */}
            <div className="h-[2px] w-12 bg-cyan-600 mb-6" />

            {/* Attributes */}
            <ul className="space-y-3 mb-8 flex-grow">
              {item.attributes.map((attr, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                  <span>{attr}</span>
                </li>
              ))}
            </ul>

            {/* Divisions (Links) */}
            <div className="pt-6 border-t border-slate-100 mt-auto">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Operating Divisions
              </span>
              <div className="flex flex-wrap gap-2">
                {item.divisions.map((div, i) => (
                  <Link
                    key={i}
                    href={`/services/${div.slug}`}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-sm hover:bg-cyan-700 hover:text-white hover:border-cyan-700 transition-colors"
                  >
                    {div.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-cyan-600 group-hover:w-full transition-all duration-500 ease-in-out" />
          </div>
        ))}
      </div>
    </section>
  );
}
