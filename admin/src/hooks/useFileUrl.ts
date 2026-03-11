// src/hooks/useFileUrl.ts
import { fileRequest } from '@/lib/api-client';
import { useEffect, useState } from 'react';

export function useFileUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    if (path.startsWith('http') || path.startsWith('blob:')) {
      setUrl(path);
      return;
    }

    let objectUrl: string;

    fileRequest(path.startsWith('/') ? path : `/uploads/${path}`)
      .then((blobUrl) => {
        objectUrl = blobUrl;
        setUrl(blobUrl);
      })
      .catch(() => setUrl(null));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return url;
}
