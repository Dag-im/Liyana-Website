'use client';

import { motion } from 'framer-motion';
import { Home, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 px-6">
      {/* Background Accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex justify-center items-center"
      >
        <div className="absolute w-[400px] h-[400px] bg-cyan-100 rounded-full blur-3xl opacity-40" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100">
            <TriangleAlert className="text-cyan-600 w-10 h-10" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight">
          404
        </h1>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-700 via-cyan-600 to-cyan-700 bg-clip-text text-transparent">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-base">
          The page you’re looking for doesn’t exist or has been moved. Let’s get
          you back on track.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-cyan-700 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 text-xs text-gray-400"
      >
        © {new Date().getFullYear()} Liyana Healthcare. All rights reserved.
      </motion.p>
    </section>
  );
}
