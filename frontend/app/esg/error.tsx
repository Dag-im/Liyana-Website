'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="mb-8 text-slate-600">
          We couldn&apos;t load the ESG page. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-[#0880b9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#01649c]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
