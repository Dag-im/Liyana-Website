'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { Division, ServiceCategory } from '@/data/services';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

// ---------- COMPONENT ----------
export default function LiyanaShowcase({
  services,
}: {
  services: ServiceCategory[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pinRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('[services-hero]'), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
        });
      }

      services.forEach((cat) => {
        const sec = pinRefs.current[cat.id];
        if (!sec) return;

        gsap.from(sec.querySelectorAll('[services-attr], [services-card]'), {
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [services]);

  const getMainImage = (division: Division): string => {
    return division.images[0] || '/placeholder.jpg'; // fallback if no images
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-white text-gray-900"
    >
      {/* Gradient Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(51,176,255,0.1),transparent_60%),radial-gradient(40%_30%_at_10%_10%,rgba(0,255,153,0.05),transparent_60%),radial-gradient(50%_30%_at_90%_10%,rgba(255,0,204,0.04),transparent_60%)]" />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-16 pt-28"
      >
        <SectionHeading
          variant="large"
          align="center"
          weight="bold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
        >
          Products & Services
        </SectionHeading>
        <p services-hero className="max-w-2xl text-center text-gray-600">
          Explore our divisions, capabilities, and specialized offerings —
          engineered for clarity, trust, and impact.
        </p>
      </section>

      {/* SECTIONS */}
      <div className="mx-auto max-w-7xl px-6 pb-28">
        {services.map((cat) => (
          <section
            key={cat.id}
            ref={(el) => {
              if (el && el instanceof HTMLDivElement)
                pinRefs.current[cat.id] = el;
            }}
            className="relative mb-24 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-10"
          >
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">{cat.title}</h2>
                <p className="text-gray-600">{cat.tagline}</p>
              </div>
            </div>

            {/* Attributes */}
            <ul className="mb-8 list-disc space-y-2 pl-5 text-gray-600">
              {cat.attributes.map((attr: string, i: number) => (
                <li key={i}>{attr}</li>
              ))}
            </ul>

            {/* Divisions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cat.divisions.map((d: Division) => (
                <article
                  key={d.id}
                  services-card
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden md:h-48">
                    <Image
                      src={getMainImage(d)}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800/20 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight">
                        {d.name}
                      </h3>
                      {d.location && (
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {d.location}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{d.overview}</p>

                    {d.coreServices?.length ? (
                      <ul className="list-disc space-y-1 pl-5 text-xs text-gray-600">
                        {d.coreServices.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-2">
                      <Link href={`/services/${d.slug}`}>
                        <button className="rounded-2xl border border-cyan-500/50 bg-cyan-100 px-3 py-2 text-xs font-medium text-cyan-700 transition hover:bg-cyan-200">
                          Learn More →
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
