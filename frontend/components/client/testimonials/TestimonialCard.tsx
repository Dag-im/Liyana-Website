'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const avatarUrl =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww';

type TestimonialCardProps = {
  name: string;
  role: string;
  message: string;
};

export function TestimonialCard({ name, role, message }: TestimonialCardProps) {
  return (
    <motion.div
      className="w-full h-full"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <Card className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-lg p-6 shadow-lg">
        {/* Top Quote Icon */}
        <Quote className="absolute top-4 left-4 w-10 h-10 text-blue-200" />

        <CardContent className="flex flex-col justify-between gap-6 p-0 pt-8">
          {/* Message */}
          <p className="text-gray-800 text-base md:text-lg italic leading-relaxed flex-1">
            {message}
          </p>

          {/* User Info */}
          <div className="flex items-center gap-4 pt-2">
            <Image
              src={avatarUrl}
              width={12}
              height={12}
              alt={name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-200 shadow-md object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm md:text-base lg:text-lg">
                {name}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
