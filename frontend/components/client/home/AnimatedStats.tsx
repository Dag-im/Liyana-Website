'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Stat } from '@/types/cms.types';
import { useLayoutEffect, useRef } from 'react';

interface AnimatedStatsProps {
  stats?: Stat[];
  className?: string;
}

const defaultStats: Stat[] = [
  { id: 'years', label: 'Years in Service', value: 12, suffix: null, sortOrder: 1 },
  {
    id: 'patients',
    label: 'Patients Served',
    value: 2000000,
    suffix: '+',
    sortOrder: 2,
  },
  { id: 'jobs', label: 'Jobs Created', value: 1000, suffix: '+', sortOrder: 3 },
  {
    id: 'facilities',
    label: 'Facilities In Operation',
    value: 15,
    suffix: '+',
    sortOrder: 4,
  },
];

export default function AnimatedStats({
  stats = defaultStats,
  className = '',
}: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Clean, professional fade-up for the container
      gsap.from('.gsap-stat-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Precise count-up numbers on scroll
      valueRefs.current.forEach((el, i) => {
        if (!el || !stats[i]) return;

        const target = stats[i].value;
        const suffix = stats[i].suffix ?? '';

        const animateCounter = () => {
          const obj = { n: 0 };

          // GSAP quickSetter is highly performant for frequent DOM updates
          const setText = gsap.quickSetter(el, 'textContent');

          gsap.to(obj, {
            n: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              const v = Math.round(obj.n).toLocaleString();
              setText(`${v}${suffix}`);
            },
            onComplete: () => {
              setText(`${Math.round(target).toLocaleString()}${suffix}`);
            },
            delay: i * 0.1,
          });
        };

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 85%',
          onEnter: animateCounter,
          // Removed onEnterBack so it doesn't distractingly recount every time you scroll up
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  // Limit to a maximum of 6 stats to maintain visual integrity in the row
  const displayStats = stats.slice(0, 6);

  return (
    <section
      ref={containerRef}
      className={`relative w-full py-24 bg-white border-y border-slate-200 selection:bg-cyan-100 selection:text-cyan-900 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[2px] w-12 bg-cyan-600" />
          <span className="text-cyan-700 font-bold uppercase tracking-widest text-sm">
            Impact & Scale
          </span>
        </div>

        {/* Using flex and flex-wrap guarantees the row distributes evenly.
          It supports 1 to 6 items perfectly. On mobile it wraps to a 2-column or 3-column grid.
        */}
        <div className="flex flex-wrap lg:flex-nowrap border border-slate-200 bg-white">
          {displayStats.map((s, i) => {
            const finalText = `${s.value.toLocaleString()}${s.suffix ?? ''}`;

            // Calculate a safe minimum width so the layout doesn't violently shift while counting
            const chWidth = Math.max(finalText.length, 3);

            return (
              <div
                key={s.label}
                className="gsap-stat-card w-1/2 md:w-1/3 lg:flex-1 p-8 md:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r last:border-r-0 border-slate-200 hover:bg-slate-50 transition-colors duration-300"
              >
                <span
                  ref={(el) => {
                    valueRefs.current[i] = el;
                  }}
                  className="block text-2xl md:text-3xl lg:text-4xl font-bold font-mono tabular-nums tracking-tighter text-slate-900 mb-3"
                  style={{ minWidth: `${chWidth}ch` }}
                  aria-label={finalText}
                >
                  0{s.suffix ?? ''}
                </span>
                <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
