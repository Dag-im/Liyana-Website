'use client';

import { SERVICES_DATA } from '@/data/services'; // Ensure path is correct
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CorporateHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SERVICES_DATA.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentCategory = SERVICES_DATA[activeIndex];

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center bg-slate-950 overflow-hidden">
      {/* 1. FULL WIDTH BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/* Using the dedicated heroImage from the category */}
            <img
              src={currentCategory.heroImage}
              alt={currentCategory.title}
              className="w-full h-full object-cover"
            />

            {/* Mobile Gradient: Heavier at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950 lg:hidden" />

            {/* Desktop Gradient: Horizontal fade (Left Dark -> Right Clear) */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            {/* Universal Overlay for consistency */}
            <div className="absolute inset-0 bg-slate-950/30 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-20 lg:px-16 lg:py-0 grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: Main Text (Stacks on top on mobile) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-8 pt-10 lg:pt-0">
          {/* Brand Identity Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-[2px] w-8 lg:w-12 bg-cyan-500" />
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">
              Liyana Corporate Group
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key="static-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] lg:leading-[0.95] tracking-tight"
          >
            Hearts + Minds <br />
            <span className="block mt-2">
              for{' '}
              <span className="bg-gradient-to-r from-[#d62839] to-[#7f3aaf] bg-clip-text text-transparent">
                Healthcare
              </span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div
            key={currentCategory.id + 'desc'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg lg:text-xl text-cyan-50/80 font-light leading-relaxed max-w-xl border-l-2 border-cyan-500/30 pl-4 lg:pl-6">
              {currentCategory.tagline}
            </p>

            {/* Mobile-friendly Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold uppercase text-xs tracking-widest hover:bg-cyan-50 transition-colors flex items-center justify-center gap-3 rounded-sm"
              >
                Explore Services
                <ArrowRight size={16} className="text-cyan-600" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Navigation List (Stacks below on mobile) */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:pl-12 pb-10 lg:pb-0">
          <div className="flex flex-col gap-1 lg:gap-2">
            {SERVICES_DATA.map((category, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative flex items-center justify-between p-4 lg:p-6 text-left transition-all duration-300 border-l-[3px] ${
                    isActive
                      ? 'border-cyan-500 bg-white/5'
                      : 'border-white/10 hover:bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={`text-lg lg:text-2xl font-bold transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {category.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
