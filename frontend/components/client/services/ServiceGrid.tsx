'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Division, ServiceCategory } from '@/data/services';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';

// Register ScrollTrigger once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------- COMPONENT ----------
export default function LiyanaShowcase({
  services,
}: {
  services: ServiceCategory[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Animation - Lighter and faster
      gsap.from('.gsap-hero', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // 2. Scroll Animations - Section by section to prevent heavy DOM thrashing
      const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');

      sections.forEach((sec) => {
        const elements = sec.querySelectorAll('.gsap-fade');

        if (elements.length > 0) {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none', // Play once, don't reverse
            },
            y: 25,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'all', // Crucial: removes inline styles after animation finishes
          });
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, [services]);

  const getMainImage = (division: Division): string => {
    return division.images?.[0] || '/placeholder.jpg';
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-white text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden"
    >
      {/* HEADER SECTION */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-20 pt-8">
        <div className="gsap-hero w-full flex justify-center">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Products & Services
          </SectionHeading>
        </div>

        <p className="gsap-hero max-w-3xl text-center text-slate-600 text-lg leading-relaxed">
          Explore our divisions, capabilities, and specialized offerings.
          Engineered for clarity, built on trust, and driven by sustainable
          impact across our operational regions.
        </p>
      </section>

      {/* CATEGORIES / DIVISIONS */}
      <div className="mx-auto max-w-7xl px-6 pb-28">
        {services.map((cat, index) => (
          <section
            key={cat.id}
            className={`gsap-section relative py-16 ${
              index !== 0 ? 'border-t border-slate-200' : ''
            }`}
          >
            {/* Category Header */}
            <div className="gsap-fade mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="md:w-2/3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[2px] w-12 bg-cyan-600" />
                  <span className="text-cyan-700 font-bold uppercase tracking-widest text-sm">
                    Sector Overview
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {cat.title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {cat.tagline}
                </p>
              </div>

              {/* Category Attributes */}
              {cat.attributes && cat.attributes.length > 0 && (
                <div className="md:w-1/3 bg-slate-50 border border-slate-200 p-6 rounded-sm">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                    Key Strengths
                  </h4>
                  <ul className="space-y-3">
                    {cat.attributes.map((attr: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <CheckCircle2
                          className="text-cyan-600 shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="leading-snug">{attr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Division Cards Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cat.divisions.map((d: Division) => (
                <article
                  key={d.id}
                  className="gsap-fade group flex flex-col h-full bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 border-b border-slate-200 shrink-0">
                    <Image
                      src={getMainImage(d)}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Location Badge */}
                    {d.location && (
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                        <MapPin size={12} className="text-cyan-600" />
                        {d.location}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-grow p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-cyan-700 transition-colors">
                      {d.name}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {d.overview}
                    </p>

                    {/* Core Services List */}
                    {d.coreServices && d.coreServices.length > 0 ? (
                      <div className="mb-8 flex-grow">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Core Capabilities
                        </p>
                        <ul className="space-y-2">
                          {d.coreServices.slice(0, 4).map((service, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 shrink-0 mt-2" />
                              <span className="leading-snug">{service}</span>
                            </li>
                          ))}
                          {d.coreServices.length > 4 && (
                            <li className="text-xs text-slate-400 italic mt-2">
                              + {d.coreServices.length - 4} more services
                            </li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="flex-grow" />
                    )}

                    {/* Action Link */}
                    <div className="pt-6 border-t border-slate-100 mt-auto">
                      <Link
                        href={`/services/${d.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 uppercase tracking-wider transition-colors"
                      >
                        Explore Division
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Decorative Bottom Line */}
                  <div className="h-1 w-full bg-slate-100 group-hover:bg-cyan-600 transition-colors duration-500" />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
