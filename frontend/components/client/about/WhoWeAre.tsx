'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const WHO_WE_ARE_TEXT =
  'A collective of innovators, problem solvers, and dreamers. We create impact through technology, healthcare, and sustainable solutions — empowering businesses and communities worldwide.';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function WhoWeAreLuxury() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-10 py-26 md:py-28 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Optional subtle animated overlay */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: ['-5%', '5%'], y: ['-5%', '5%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-tr from-gray-100/5 via-white/5 to-gray-200/5"
        />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT: Text */}
        <div className="flex-1 text-left z-10">
          <motion.h2
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-cyan-500 to-cyan-600 mb-6"
          >
            Who We Are
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed tracking-wide"
          >
            {WHO_WE_ARE_TEXT}
          </motion.p>
        </div>

        {/* RIGHT: Image */}
        <motion.div
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex-1 relative w-full max-w-lg h-96 md:h-[480px] lg:h-[500px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
            alt="Who we are"
            fill
            className="object-cover rounded-3xl shadow-2xl"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
