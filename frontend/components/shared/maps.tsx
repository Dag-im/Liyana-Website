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
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d708.6380808074242!2d38.82733565464453!3d9.020802970087932!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9aaec595a7ff%3A0x4a1e50dbaf526f5f!2sCheshire%20Ethiopia%20-%20Head%20Office!5e0!3m2!1sen!2set!4v1776842541922!5m2!1sen!2set"
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
