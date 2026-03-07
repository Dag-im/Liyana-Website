'use client';

import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Calendar, Lightbulb, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  location?: string;
  achievement?: string;
  image?: string;
  category?: 'milestone' | 'achievement' | 'expansion' | 'innovation';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const Timeline = ({
  items,
  className = '',
  title,
  subtitle,
}: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.from('.timeline-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'achievement':
        return <Award className="w-5 h-5 text-cyan-600" />;
      case 'expansion':
        return <MapPin className="w-5 h-5 text-cyan-600" />;
      case 'innovation':
        return <Lightbulb className="w-5 h-5 text-cyan-600" />;
      default:
        return <Calendar className="w-5 h-5 text-cyan-600" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-slate-50 py-24 selection:bg-cyan-100 selection:text-cyan-900 ${className}`}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-20 text-center">
        {title && (
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6 text-center"
          >
            {title}
          </SectionHeading>
        )}
        {subtitle && (
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timeline body */}
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Main Vertical Line */}
        <div className="absolute left-[39px] md:left-[50%] top-0 bottom-0 w-[2px] bg-slate-200 transform md:-translate-x-1/2" />

        <div className="space-y-16 md:space-y-24">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`timeline-item relative flex flex-col md:flex-row items-start md:justify-between w-full group`}
              >
                {/* Center Node (Dot) */}
                <div className="absolute left-[31px] md:left-[50%] md:-translate-x-1/2 w-4 h-4 bg-white border-2 border-cyan-600 rounded-full z-10 group-hover:bg-cyan-600 group-hover:scale-125 transition-all duration-300 mt-1.5 md:mt-0 md:top-[28px]" />

                {/* Left Content (or mobile right) */}
                <div
                  className={`md:w-[45%] pl-20 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:hidden'}`}
                >
                  {isEven && (
                    <div className="hidden md:block">
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">
                        {item.year}
                      </h3>
                      <div className="flex items-center justify-end gap-2 text-cyan-700 font-bold uppercase tracking-wider text-sm mb-4">
                        {item.category || 'Milestone'}
                        {getCategoryIcon(item.category)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Content */}
                <div
                  className={`w-full pl-20 md:pl-0 md:w-[45%] ${!isEven ? 'md:text-left md:pl-12' : ''}`}
                >
                  {/* Mobile Year/Category Header OR Desktop Odd Content Header */}
                  <div className={`${isEven ? 'md:hidden' : 'mb-4'}`}>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      {item.year}
                    </h3>
                    <div className="flex items-center gap-2 text-cyan-700 font-bold uppercase tracking-wider text-sm mb-4">
                      {getCategoryIcon(item.category)}
                      {item.category || 'Milestone'}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white border border-slate-200 p-8 shadow-sm group-hover:shadow-md transition-shadow">
                    {item.image && (
                      <div className="mb-6 relative h-48 w-full bg-slate-100 border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h4>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {(item.location || item.achievement) && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                        {item.location && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <MapPin size={14} className="text-slate-400" />
                            {item.location}
                          </span>
                        )}
                        {item.achievement && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Award size={14} className="text-slate-400" />
                            {item.achievement}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
