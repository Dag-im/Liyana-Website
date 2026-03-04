'use client';

import gsap from 'gsap';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export interface EventNewsCardProps {
  id: string;
  type: 'news' | 'event';
  title: string;
  date: string;
  summary: string;
  location?: string;
  keyHighlights?: string[];
  content: string[];
  mainImage: string;
  image1?: string;
  image2?: string;
}

export function EventNewsCard({
  id,
  type,
  title,
  date,
  summary,
  location,
  mainImage,
}: EventNewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.3, ease: 'power2.out' });
    gsap.to('.card-arrow', { x: 5, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to('.card-arrow', { x: 0, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/news-events/${id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        group cursor-pointer flex flex-col h-full bg-white
        border border-slate-200 shadow-sm
        transition-shadow duration-300 hover:shadow-lg
      "
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Type Badge */}
        <div className="absolute top-0 left-0 bg-cyan-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {type}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6">
        {/* Meta Data - STACKED LAYOUT */}
        <div className="flex flex-col gap-2 mb-4 border-b border-slate-100 pb-4">
          {/* Date */}
          <span className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wide">
            <Calendar size={14} />
            {date}
          </span>

          {/* Location (Only for events) - On its own line */}
          {type === 'event' && location && (
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin size={14} className="text-slate-400" />
              {location}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-cyan-700 transition-colors">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-grow">
          {summary}
        </p>

        {/* Footer / CTA */}
        <div className="pt-4 mt-auto flex items-center text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
          Read Full Story
          <ArrowRight size={16} className="card-arrow ml-2 text-cyan-500" />
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 w-0 group-hover:w-full bg-cyan-600 transition-all duration-500 ease-in-out" />
    </div>
  );
}
