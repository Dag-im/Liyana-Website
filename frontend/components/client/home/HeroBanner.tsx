'use client';

import { SERVICES_DATA } from '@/data/services'; // Ensure path is correct
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
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

  // --- SLIDING TRACK LOGIC ---
  const VISIBLE_ITEMS = 4;
  const hasOverflow = SERVICES_DATA.length > VISIBLE_ITEMS;

  // Calculate how far the track should slide.
  // We subtract 1 from activeIndex to keep the active item roughly in the second position when possible.
  const maxSlideIndex = Math.max(0, SERVICES_DATA.length - VISIBLE_ITEMS);
  const slidingIndex = Math.min(Math.max(0, activeIndex - 1), maxSlideIndex);

  // Dynamic fade mask: Only fade top if scrolled down, only fade bottom if more items below
  let maskStyle = {};
  if (hasOverflow) {
    const topFade =
      slidingIndex > 0 ? 'transparent 0%, black 15%' : 'black 0%, black 15%';
    const bottomFade =
      slidingIndex < maxSlideIndex
        ? 'black 85%, transparent 100%'
        : 'black 85%, black 100%';
    const maskImage = `linear-gradient(to bottom, ${topFade}, ${bottomFade})`;
    maskStyle = {
      WebkitMaskImage: maskImage,
      maskImage: maskImage,
      transition: 'mask-image 0.5s ease',
    };
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center bg-cyan-950 overflow-hidden -top-20">
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
            <Image
              src={currentCategory.heroImage}
              alt={currentCategory.title}
              fill
              className="w-full h-full object-cover"
              priority
            />

            {/* Mobile Gradient: Heavier at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-800/60 via-cyan-800/40 to-slate-950 lg:hidden" />

            {/* Desktop Gradient: Horizontal fade (Left Dark -> Right Clear) */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-cyan-800 via-cyan-800/70 to-transparent" />

            {/* Universal Overlay for consistency */}
            <div className="absolute inset-0 bg-cyan-950/30 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-20 lg:px-16 lg:py-0 grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: Main Text */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-8 pt-10 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-[2px] w-8 lg:w-12 bg-cyan-500" />
            <span className="text-cyan-400 text-md font-bold uppercase tracking-[0.2em]">
              Hearts + Minds for Healthcare
            </span>
          </motion.div>

          <motion.h1
            key="static-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] lg:leading-[0.95] tracking-tight"
          >
            Liyana <br />
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-[#d62839] to-[#7f3aaf] bg-clip-text text-transparent">
                Healthcare
              </span>
            </span>
          </motion.h1>

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
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/services"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-transparent font-bold uppercase text-[11px] tracking-[0.2em] text-slate-900 overflow-hidden rounded-sm transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.3)]"
            >
              {/* 1. Sweeping Background Slide */}
              <span className="absolute inset-0 w-full h-full -translate-x-full bg-cyan-600 group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />

              {/* 2. Button Text */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 delay-75">
                Explore Services
              </span>

              {/* 3. The "Teleporting" Arrow Container */}
              <span className="relative z-10 flex overflow-hidden w-4 h-4 items-center justify-center">
                {/* Arrow that shoots out to the right */}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="absolute text-cyan-600 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[150%] group-hover:opacity-0"
                />

                {/* Arrow that slides in from the left */}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="absolute text-white transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-x-[150%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-75"
                />
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Navigation List with Sliding Track */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:pl-12 pb-10 lg:pb-0">
          <div className="relative overflow-hidden w-full" style={maskStyle}>
            {/* INVISIBLE SIZER
              This block maps only 4 items but hides them. It perfectly forces
              the wrapper container to be exactly the height of 4 items naturally,
              keeping your UI responsive without hardcoded pixels.
            */}
            <div
              className="flex flex-col invisible pointer-events-none"
              aria-hidden="true"
            >
              {SERVICES_DATA.slice(0, VISIBLE_ITEMS).map((category, index) => (
                <div
                  key={`sizer-${category.id}`}
                  className="p-4 lg:p-6 mb-1 lg:mb-2 border-l-[3px] border-transparent"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
                      0{index + 1}
                    </span>
                    <span className="text-lg lg:text-2xl font-bold">
                      {category.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SLIDING TRACK
              This track positions itself absolutely over the invisible sizer and
              slides up/down to show the active items.
            */}
            <motion.div
              className="absolute top-0 left-0 w-full flex flex-col"
              animate={{
                y: `-${(slidingIndex / SERVICES_DATA.length) * 100}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 20,
                mass: 0.8,
              }}
            >
              {SERVICES_DATA.map((category, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveIndex(index)}
                    // Note: Changed `gap` on container to `mb` on items for flawless percentage translation math
                    className={`group relative flex items-center justify-between p-4 lg:p-6 mb-1 lg:mb-2 text-left transition-all duration-300 border-l-[3px] ${
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
                        {/* Ensure index is formatted as 01, 02, etc. */}
                        {(index + 1).toString().padStart(2, '0')}
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-8 rounded-full border border-white/40 flex justify-center">
            <motion.span
              className="w-1 h-1 rounded-full bg-white/70 mt-2"
              animate={{ y: [0, 10, 0], opacity: [0.7, 0.3, 0.7] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            Scroll
          </span>
        </div>
      </motion.div>
    </section>
  );
}
