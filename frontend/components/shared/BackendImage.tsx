import { getFileUrl } from '@/lib/api-client';
import Image from 'next/image';
import type { ComponentProps } from 'react';

type BackendImageProps = Omit<ComponentProps<typeof Image>, 'src'> & {
  src: string | null | undefined;
  fallback?: string;
};

export default function BackendImage({
  src,
  fallback = '/images/logo.png',
  alt,
  ...props
}: BackendImageProps) {
  const resolvedSrc = getFileUrl(src) ?? fallback;
  return <Image src={resolvedSrc} alt={alt} {...props} />;
}
