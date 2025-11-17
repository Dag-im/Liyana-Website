'use client';

import gsap from 'gsap';
import { Calendar, Newspaper } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

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
  image1: string;
  image2: string;
}

export function EventNewsCard({
  id,
  type,
  title,
  date,
  summary,
  mainImage,
}: EventNewsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/news-events/${id}`)}
      className="
        group cursor-pointer relative overflow-hidden
        rounded-xl bg-white dark:bg-neutral-950
        border border-gray-200 dark:border-neutral-800
        shadow-md transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
      "
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-[1.05]
          "
        />

        {/* softer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-2.5 relative z-10">
        <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-cyan-500 transition-colors">
          {title}
        </h3>

        <p className="text-xs font-medium text-gray-500">{date}</p>

        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {summary}
        </p>
      </div>

      {/* Badge */}
      <div
        className="
          absolute top-4 left-4 px-3 py-1.5 rounded-md
          bg-gradient-to-r from-cyan-950 via-cyan-600 to-cyan-500
          text-white text-[11px] font-semibold shadow-sm
          flex items-center gap-1 tracking-wide
        "
      >
        {type === 'event' ? <Calendar size={13} /> : <Newspaper size={13} />}
        <span>{type.toUpperCase()}</span>
      </div>
    </div>
  );
}
