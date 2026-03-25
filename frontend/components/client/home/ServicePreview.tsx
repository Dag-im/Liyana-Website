'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { getServiceIcon } from '@/lib/icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ServiceCategory } from '@/types/services.types';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// ---------- COMPONENT ----------
interface ServicePreviewProps {
  categories?: ServiceCategory[];
}

export default function LiyanaSummary({
  categories = [],
}: ServicePreviewProps) {
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
      className="px-6 pb-24 border-b border-slate-200 selection:bg-[#cceffa] selection:text-[#014f7a]"
    >
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col items-center">
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-[#33bde9] to-[#0880b9] mb-6"
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
        {categories.map((item) => {
          const Icon = getServiceIcon(item.icon);
          return (
            <div
              key={item.id}
              className="corporate-card group relative flex flex-col bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Header: Icon & Title */}
              <div className="mb-6">
                <div className="mb-5 inline-flex p-3 bg-slate-50 border border-slate-100 rounded-sm">
                  <Icon className="h-8 w-8 text-[#01649c]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
              </div>

            {/* Accent Divider */}
            <div className="h-[2px] w-12 bg-[#0880b9] mb-6" />

            {/* Attributes */}
            <ul className="space-y-3 mb-8 flex-grow">
              {item.attributes.map((attr, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#0880b9] mt-0.5 shrink-0" />
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
                {(item.divisions ?? []).map((div, i) => (
                  <Link
                    key={i}
                    href={`/services/${div.slug}`}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-sm hover:bg-[#01649c] hover:text-white hover:border-[#01649c] transition-colors"
                  >
                    {div.name}
                  </Link>
                ))}
              </div>
            </div>

              {/* Hover Accent Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#0880b9] group-hover:w-full transition-all duration-500 ease-in-out" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
