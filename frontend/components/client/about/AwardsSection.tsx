'use client';

import BackendImage from '@/components/shared/BackendImage';
import { SectionHeading } from '@/components/shared/sectionHeading';
import gsap from 'gsap';
import { Award as AwardIcon, X } from 'lucide-react';
import type { Award } from '@/types/awards.types';
import { useEffect, useRef, useState } from 'react';

interface AwardsSectionProps {
  awards?: Award[];
}

export default function AwardsSection({ awards = [] }: AwardsSectionProps) {
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Animate awards on filter or load more
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.award-card',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [awards]);

  return (
    <section className="pt-10 pb-24 px-6 bg-white selection:bg-cyan-100 selection:text-cyan-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <SectionHeading
            variant="large"
            align="center"
            weight="bold"
            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Awards & Recognition
          </SectionHeading>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our dedication to advancing healthcare has earned us prestigious
            accolades from industry leaders, reflecting our commitment to
            quality.
          </p>
        </div>

        {/* Awards Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award) => (
            <div
              key={award.id}
              className="award-card group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Top Half */}
              <div className="relative w-full h-56 bg-slate-100 border-b border-slate-200 overflow-hidden">
                <BackendImage
                  src={award.image}
                  alt={award.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm rounded-sm">
                  {award.category}
                </div>
              </div>

              {/* Content Bottom Half */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                  {award.title}
                </h3>
                <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                  {award.organization}{' '}
                  <span className="text-cyan-600 mx-1">•</span> {award.year}
                </p>

                <div className="h-[1px] w-full bg-slate-100 mb-4" />

                <p className="text-slate-600 leading-relaxed text-sm flex-grow mb-6">
                  {award.description}
                </p>

                <button
                  onClick={() => setSelectedAward(award)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 uppercase tracking-wider transition-colors"
                >
                  <AwardIcon className="w-4 h-4" />
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Modal */}
        {selectedAward && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedAward(null)}
          >
            <div
              className="bg-white rounded-sm w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedAward.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {selectedAward.organization}{' '}
                    <span className="text-cyan-600 mx-1">•</span>{' '}
                    {selectedAward.year}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAward(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Image */}
              <div className="p-6 bg-slate-50 flex-grow overflow-auto flex items-center justify-center">
                <div className="relative w-full max-w-2xl h-[50vh] min-h-[300px]">
                  <BackendImage
                    src={selectedAward.image}
                    alt={selectedAward.imageAlt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
