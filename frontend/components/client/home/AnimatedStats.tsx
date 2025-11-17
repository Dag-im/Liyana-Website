'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Stat = { label: string; value: number; suffix?: string };

interface AnimatedStatsProps {
  stats?: Stat[];
  className?: string;
}

const defaultStats: Stat[] = [
  { label: 'Years in Service', value: 12 },
  { label: 'Patients Served', value: 2_000_000, suffix: '+' },
  { label: 'Jobs Created', value: 1_000, suffix: '+' },
];

export default function AnimatedStats({
  stats = defaultStats,
  className = '',
}: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate cards in on scroll
      gsap.from('.stat-card', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Count-up numbers on scroll (every time)
      valueRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].value;
        const suffix = stats[i].suffix ?? '';

        const animateCounter = () => {
          const obj = { n: 0 };
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

        // Trigger on enter (scroll down) & enterBack (scroll up)
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 80%',
          onEnter: animateCounter,
          onEnterBack: animateCounter,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full py-20 flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Soft gradient background */}
      <div
        className="
          absolute inset-0 -z-10
          bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100
          animate-[bg-pan_20s_ease-in-out_infinite]
        "
      />

      <div className="max-w-5xl w-full px-6">
        <div
          className="
            grid grid-cols-1 md:grid-cols-3 gap-10
            rounded-3xl p-10 md:p-12
            bg-white/40 backdrop-blur-xl ring-1 ring-white/30
            shadow-xl
          "
        >
          {stats.map((s, i) => {
            const finalText = `${s.value.toLocaleString()}${s.suffix ?? ''}`;
            const chWidth = Math.max(finalText.length, 2);

            return (
              <div key={s.label} className="stat-card text-center">
                <span
                  ref={(el) => {
                    if (el) valueRefs.current[i] = el;
                  }}
                  className="
                    block
                    text-4xl md:text-5xl font-semibold
                    font-mono tabular-nums tracking-tight
                    text-gray-900
                  "
                  style={{ minWidth: `${chWidth}ch` }}
                  aria-label={finalText}
                />
                <div className="mt-3 text-base md:text-lg font-medium text-gray-700">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local keyframes for background movement */}
      <style>{`
        @keyframes bg-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[bg-pan_20s_ease-in-out_infinite] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
