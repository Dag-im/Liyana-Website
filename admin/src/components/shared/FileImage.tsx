// src/components/shared/FileImage.tsx
import { useFileUrl } from '@/hooks/useFileUrl';

type FileImageProps = {
  path: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
};

export function FileImage({ path, alt, className, fallback }: FileImageProps) {
  const url = useFileUrl(path);

  console.log('FileImage', { path, url });

  if (!url) return fallback ? <>{fallback}</> : null;

  return <img src={url} alt={alt} className={className} />;
}
