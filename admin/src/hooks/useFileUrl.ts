// src/hooks/useFileUrl.ts
import { fileRequest } from '@/lib/api-client';
import { useEffect, useState } from 'react';

export function useFileUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    if (path.startsWith('http') || path.startsWith('blob:')) {
      setUrl(path);
      return;
    }

    let objectUrl: string;
    let cancelled = false;

    fileRequest(path.startsWith('/') ? path : `/uploads/${path}`)
      .then((blobUrl) => {
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        objectUrl = blobUrl;
        setUrl(blobUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(null);
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return url;
}
