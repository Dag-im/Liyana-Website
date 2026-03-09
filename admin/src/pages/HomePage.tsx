import { useQuery } from '@tanstack/react-query'

import { apiRequest } from '@/lib/api-client'

export default function HomePage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: () => apiRequest<string>('/'),
  })

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        React + TypeScript + Tailwind + shadcn/ui starter is ready.
      </p>
      <p className="text-sm">
        API status:{' '}
        {healthQuery.isLoading
          ? 'checking...'
          : healthQuery.isError
            ? 'unreachable'
            : healthQuery.data}
      </p>
    </section>
  )
}
