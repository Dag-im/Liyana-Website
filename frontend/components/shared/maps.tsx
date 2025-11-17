'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SimpleGoogleMapProps {
  width?: string;
  height?: string;
  className?: string;
}

const SimpleGoogleMap: React.FC<SimpleGoogleMapProps> = ({
  width = '100%',
  height = '400px',
  className,
}) => {
  return (
    <div
      className={cn('overflow-hidden rounded-lg', className)}
      style={{ width, height }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086963139274!2d-122.41941508468102!3d37.77492927975925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c5f0a6e1f%3A0x49d6ed3a68e8a0!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1697058486200!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default SimpleGoogleMap;
