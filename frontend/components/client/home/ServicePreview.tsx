'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import { SERVICES_DATA } from '@/data/services';
import { motion } from 'framer-motion';
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
  'advanced-services': <Hospital className="h-10 w-10 text-cyan-600" />,
  'education-research': <GraduationCap className="h-10 w-10 text-cyan-600" />,
  'drugs-supplies-import': <Pill className="h-10 w-10 text-cyan-600" />,
  'product-manufacturing': <Factory className="h-10 w-10 text-cyan-600" />,
};

// ---------- COMPONENT ----------
export default function LiyanaSummary() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.card'),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="px-6 py-20 bg-gray-50 min-h-screen">
      <SectionHeading
        variant="large"
        align="center"
        weight="bold"
        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
      >
        Products & Services
      </SectionHeading>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {SERVICES_DATA.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 250 }}
            className="card rounded-2xl p-7 shadow-lg bg-white border border-gray-200 flex flex-col hover:shadow-2xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-cyan-100 rounded-xl">
                {iconMap[item.id]}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 leading-snug">
                {item.title}
              </h3>
            </div>

            {/* Attributes */}
            <ul className="space-y-2 mb-6">
              {item.attributes.map((attr, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-600 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                  <span>{attr}</span>
                </li>
              ))}
            </ul>

            {/* Divisions */}
            <div className="mt-auto">
              <h4 className="text-cyan-600 font-medium mb-3">Divisions</h4>
              <div className="flex flex-wrap gap-2">
                {item.divisions.map((div, i) => (
                  <Link
                    key={i}
                    href={`/services/${div.slug}`}
                    className="px-3 py-1 text-xs bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-full hover:bg-cyan-100 transition"
                  >
                    {div.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
