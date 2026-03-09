'use client';

import { useEffect, useState } from 'react';

import { apiRequest } from '@/lib/api-client';

type StatusState = 'checking' | 'online' | 'offline';

export default function ApiStatusBadge() {
  const [status, setStatus] = useState<StatusState>('checking');

  useEffect(() => {
    let mounted = true;

    apiRequest<string>('/')
      .then(() => {
        if (mounted) {
          setStatus('online');
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus('offline');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto mb-4 max-w-7xl px-6 pt-4">
      <p className="text-xs text-muted-foreground">API: {status}</p>
    </div>
  );
}
