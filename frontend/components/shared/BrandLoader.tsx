'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type BrandLoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
};

export default function BrandLoader({
  size = 'md',
  fullScreen = true,
  message = 'Preparing your care experience',
}: BrandLoaderProps) {
  const sizeMap = {
    sm: { width: 100, height: 50 },
    md: { width: 160, height: 80 },
    lg: { width: 220, height: 110 },
  };

  const { width, height } = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center overflow-hidden ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#F8FAFC]'
          : 'min-h-[400px] w-full bg-transparent'
      }`}
    >
      {/* 1. SOFT BOKEH BACKGROUND (Friendly & Warm) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] bg-[#cceffa]/40 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-red-50/50 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* 2. THE LOGO: PRONOUNCED BREATHING (10% Zoom) */}
        <div className="relative mb-16 flex items-center justify-center">
          {/* 1. THE LUXURY GLOW LAYERS (Separated from the logo to prevent blur) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Inner "Radiance" - Very soft white core */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-full h-full bg-white blur-[40px] rounded-full"
            />

            {/* Outer "Aura" - Using your brand colors at ultra-low opacity */}
            <motion.div
              animate={{
                scale: [1.2, 1.5, 1.2],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-[#d62839] via-[#7f3aaf] to-[#009ad6] blur-[70px] rounded-full"
            />
          </div>

          {/* 2. THE LOGO: KEPT CRISP & SHARP */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1], // The 10% zoom you wanted
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10" // High z-index keeps it above the blurs
          >
            <Image
              src="/images/logo.png"
              alt="Liyana Healthcare"
              width={width}
              height={height}
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* 3. STABILIZED PROGRESS (Liquid Flow) */}
        <div className="flex flex-col items-center gap-8 w-56 md:w-64">
          <div className="relative w-full h-[3px] bg-slate-200/40 rounded-full overflow-hidden">
            {/* Single Unified Motion Element to prevent glitching */}
            {/* Layer 1: The Base Filling Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
              style={{ originX: 0 }}
              className="absolute inset-0 z-10 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-[#009ad6]"
            />

            {/* Layer 2: The Moving Shimmer (Fixed height/width to prevent glitching) */}
            <motion.div
              animate={{ x: ['-100%', '250%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-[40%] z-20 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase text-center"
          >
            {message}
          </motion.p>
        </div>
      </div>

      {/* 4. GROUNDED FOOTER */}
      {fullScreen && (
        <div className="absolute bottom-12 flex items-center gap-5 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d62839]" />
          <p className="text-[9px] uppercase tracking-[0.5em] text-slate-500 font-bold">
            Liyana Healthcare
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-[#009ad6]" />
        </div>
      )}
    </motion.div>
  );
}
