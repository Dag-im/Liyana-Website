'use client';

import { Testimonial } from '@/data/testimonials';
import { Quote } from 'lucide-react';

export function TestimonialCard({ name, role, company, message }: Testimonial) {
  return (
    <div className="relative h-full flex flex-col justify-between bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Brand Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-cyan-500" />

      <div className="p-8 flex flex-col h-full">
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-slate-200 mb-6 group-hover:text-cyan-800/60 transition-colors duration-300" />

        {/* Message */}
        <p className="text-slate-700 text-[15px] leading-relaxed mb-8 flex-1">
          &ldquo;{message}&rdquo;
        </p>

        {/* Author Info */}
        <div className="border-t border-slate-100 pt-5 mt-auto">
          <p className="font-semibold text-slate-900 text-base">{name}</p>
          <p className="text-xs font-medium text-cyan-600 mt-1 uppercase tracking-wide">
            {role}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{company}</p>
        </div>
      </div>
    </div>
  );
}
