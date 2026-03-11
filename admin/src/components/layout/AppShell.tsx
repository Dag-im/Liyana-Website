import { Link, NavLink, Outlet } from 'react-router-dom'

import NotificationBell from '@/components/layout/NotificationBell'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'
import { APP_NAVIGATION } from '@/types/navigation'

export default function AppShell() {
  const authQuery = useAuth()
  const user = authQuery.data

  const routes = APP_NAVIGATION.filter((route) => {
    if (!route.roles) return true
    return user?.role && route.roles.includes(user.role)
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link className="text-lg font-semibold" to="/users">
            Liyana Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r px-4 py-6">
          <nav className="space-y-1">
            {routes.map((route) => {
              const Icon = route.icon

              return (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                      isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground',
                    )
                  }
                  key={route.path}
                  to={route.path}
                >
                  <Icon className="h-4 w-4" />
                  {route.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
