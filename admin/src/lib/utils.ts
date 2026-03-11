import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { UserRole } from '@/types/user.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
};

export const truncate = (str: string, max: number): string =>
  str.length <= max ? str : `${str.slice(0, max)}...`;

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-700';
    case 'COMMUNICATION':
      return 'bg-blue-100 text-blue-700';
    case 'HR':
      return 'bg-emerald-100 text-emerald-700';
    case 'BLOGGER':
      return 'bg-zinc-100 text-zinc-700';
    default:
      return 'bg-muted text-foreground';
  }
};

// src/lib/utils.ts — add this helper
export function getFileUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute
  return `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${path}`;
}
