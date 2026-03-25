'use client';

import BackendImage from '@/components/shared/BackendImage';
import type { NewsEvent } from '@/types/news-events.types';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export type EventNewsCardProps = NewsEvent;

function formatDisplayDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

export function EventNewsCard({
  id,
  type,
  title,
  date,
  summary,
  location,
  mainImage,
}: NewsEvent) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/news-events/${id}`}
        className="relative block h-56 w-full shrink-0 overflow-hidden bg-slate-100"
      >
        <BackendImage
          src={mainImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 rounded-sm bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-sm">
          {type === 'news' ? 'News' : 'Event'}
        </div>
      </Link>

      <div className="flex flex-grow flex-col p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="inline-flex items-center gap-1.5 text-[#01649c]">
            <Calendar size={14} />
            {formatDisplayDate(date)}
          </span>
          {type === 'event' && location ? (
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-slate-500">
              <MapPin size={14} className="text-slate-400" />
              {location}
            </span>
          ) : null}
        </div>

        <Link href={`/news-events/${id}`}>
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#01649c]">
            {title}
          </h3>
        </Link>

        <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-slate-600">
          {summary}
        </p>

        <Link
          href={`/news-events/${id}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#01649c] transition-colors duration-300 hover:text-[#014f7a]"
        >
          Read More <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
