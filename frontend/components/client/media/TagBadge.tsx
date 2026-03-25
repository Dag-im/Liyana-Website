'use client';

import type { MediaTag } from '@/types/media.types';

export const TagBadge = ({ tag }: { tag: MediaTag | string }) => (
  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider rounded-full bg-[#cceffa] text-[#014f7a] border border-[#99def5]">
    {typeof tag === 'string' ? tag : tag.name}
  </span>
);
