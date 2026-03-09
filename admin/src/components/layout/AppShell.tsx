import { Link, Outlet } from 'react-router-dom'

import type { AppRoute } from '@/types/navigation'

const routes: AppRoute[] = [
  { path: '/', label: 'Home' },
]

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <p className="text-lg font-semibold">Liyana Admin</p>
          <nav className="flex items-center gap-4 text-sm">
            {routes.map((route) => (
              <Link key={route.path} className="hover:underline" to={route.path}>
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
