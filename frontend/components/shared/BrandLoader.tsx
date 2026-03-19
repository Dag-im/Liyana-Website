'use client';

import Image from 'next/image';

type BrandLoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
};

export default function BrandLoader({
  size = 'md',
  fullScreen = true,
  message = "Loading experience...",
}: BrandLoaderProps) {
  const sizeMap = {
    sm: { width: 100, height: 50 },
    md: { width: 160, height: 80 },
    lg: { width: 220, height: 110 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 transition-all duration-700 ${
        fullScreen
          ? 'fixed inset-0 z-[9999] bg-[#05101e]/95 backdrop-blur-md'
          : 'min-h-[400px] w-full bg-transparent'
      }`}
    >
      {/* Brand Gradient Top Border (Consistent with Footer) */}
      {fullScreen && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-cyan-500 animate-[shimmer_2s_infinite]" />
      )}

      <div className="relative flex items-center justify-center">
        {/* Subtle Orbital Ring - Replaces the loud heartbeat-ring */}
        <div className="absolute inset-[-40px] rounded-full border border-white/[0.03] animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-[-40px] rounded-full border-t border-cyan-500/20 animate-[spin_3s_ease-in-out_infinite]" />

        {/* Logo Container */}
        <div className="relative z-10 p-2 transition-transform duration-500 hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="Liyana Healthcare"
            width={width}
            height={height}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Corporate Progress Bar */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-[1.5px] overflow-hidden bg-white/10 rounded-full">
          {/* Animated Brand Gradient Bar */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-cyan-500 animate-[corporate-load_2s_ease-in-out_infinite]" />
        </div>

        {message && (
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-500 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
