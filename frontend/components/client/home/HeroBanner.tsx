'use client';

import { motion, Variants } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const defaultImages = [
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=900',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80&auto=format&fit=crop',
];

type ImageGrid = string[];

interface HeroBannerProps {
  images?: string[];
}

export default function HeroBanner({
  images = defaultImages,
}: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isShifting, setIsShifting] = useState(false);

  const getRotatedGrid = useCallback(
    (index: number): ImageGrid => {
      return [...images.slice(index), ...images.slice(0, index)].slice(0, 6);
    },
    [images]
  );

  const currentGrid = getRotatedGrid(activeIndex);

  // Auto-rotate
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(() => {
        document.documentElement.style.setProperty('--image-opacity', '0');
        setIsShifting(true);

        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % images.length);
        }, 300);

        setTimeout(() => {
          document.documentElement.style.setProperty('--image-opacity', '1');
          setIsShifting(false);
        }, 600);
      }, 5000);
    }

    return () => interval && clearInterval(interval);
  }, [isPaused, images.length]);

  // Handle manual image selection
  const handleImageClick = (clickedSrc: string) => {
    const newIndex = images.indexOf(clickedSrc);
    if (newIndex !== -1) {
      setActiveIndex(newIndex);
    }
  };

  // Animations
  const mainVariants: Variants = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  const layoutVariants: Variants = {
    initial: { x: 0, y: 0, rotate: 0, transition: { duration: 0.6 } },
    shifting: {
      x: [0, -10, 10, 0],
      y: [0, -5, 5, 0],
      rotate: [0, 1, -1, 0],
      transition: { duration: 0.6, ease: 'easeInOut', times: [0, 0.3, 0.6, 1] },
    },
    animate: { x: 0, y: 0, rotate: 0, transition: { duration: 0.4 } },
  };

  const gridVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
    shift: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#f8feff] px-6 lg:px-20 py-20"
      style={{ '--image-opacity': '1' } as React.CSSProperties}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,180,216,0.06)_0%,transparent_60%)]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 text-gray-800
                     text-left
                     items-center lg:items-start
                     w-full"
        >
          <motion.h1
            id="hero-title"
            className="text-[65px] sm:text-7xl lg:text-[80px] font-extrabold leading-tight text-black"
          >
            Hearts + Minds
            <br />
            for{' '}
            <span className="bg-gradient-to-r from-[#d62839] to-[#7f3aaf] bg-clip-text text-transparent">
              Healthcare
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-lg lg:max-w-none"
          >
            At Liyana Healthcare, we combine compassion, innovation, and
            excellence to redefine modern healthcare.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.a
              href="/news-events"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(0,180,216,0.3)',
              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-800 text-white font-semibold transition duration-300 text-center"
            >
              Latest Updates
            </motion.a>
            <motion.a
              href="/services"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(0,180,216,0.3)',
              }}
              className="px-8 py-4 rounded-full border-2 border-cyan-500 text-cyan-500 font-semibold transition duration-300 text-center"
            >
              Our Service
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: Bento Grid */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[50vh] lg:h-[70vh]"
        >
          <motion.div
            variants={gridVariants}
            animate={isShifting ? 'shift' : 'animate'}
            className="grid grid-cols-3 grid-rows-3 gap-4 h-full"
          >
            {/* Main large image */}
            <motion.div
              layout
              variants={layoutVariants}
              initial="initial"
              animate={isShifting ? 'shifting' : 'animate'}
              className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl shadow-xl border border-gray-200/50 bg-white/5 backdrop-blur-sm cursor-pointer"
              style={{
                opacity: 'var(--image-opacity, 1)',
                transition: 'opacity 0.3s ease-in-out',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleImageClick(currentGrid[0])}
            >
              <motion.img
                key={currentGrid[0]}
                src={currentGrid[0]}
                alt="Main healthcare visual"
                className="absolute inset-0 w-full h-full object-cover"
                variants={mainVariants}
                animate="animate"
                initial={false}
              />
            </motion.div>

            {/* Smaller grid images */}
            {currentGrid.slice(1).map((src, index) => (
              <motion.div
                layout
                key={src}
                variants={layoutVariants}
                initial="initial"
                animate={isShifting ? 'shifting' : 'animate'}
                className="relative overflow-hidden rounded-2xl shadow-md col-span-1 row-span-1 border border-gray-200/50 bg-white/5 backdrop-blur-sm cursor-pointer"
                style={{
                  opacity: 'var(--image-opacity, 1)',
                  transition: 'opacity 0.3s ease-in-out',
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleImageClick(src)}
              >
                <motion.img
                  src={src}
                  alt={`Healthcare image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --image-opacity: 1;
        }
      `}</style>
    </section>
  );
}
