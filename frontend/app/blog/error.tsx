'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-8">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#0880b9] text-white font-semibold hover:bg-[#01649c] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
