'use client';

import type { MediaTag } from '@/types/media.types';

export const TagBadge = ({ tag }: { tag: MediaTag | string }) => (
  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
    {typeof tag === 'string' ? tag : tag.name}
  </span>
);
