import {
  Bell,
  CalendarDays,
  FileText,
  Image,
  Info,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

import { logout } from '@/api/auth.api';
import NotificationBell from '@/components/layout/NotificationBell';
import AppInput from '@/components/system/AppInput';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth/useAuth';
import { useMyDivision } from '@/features/my-division/useMyDivision';
import { showErrorToast } from '@/lib/error-utils';
import { cn } from '@/lib/utils';
import { APP_NAVIGATION } from '@/types/navigation';

export default function AppShell() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const authQuery = useAuth();
  const user = authQuery.data;
  const { data: myDivision } = useMyDivision();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Logged out');
      window.location.assign('/login');
    },
    onError: (error) => showErrorToast(error, 'Failed to log out'),
  });

  const routes = useMemo(
    () =>
      APP_NAVIGATION.reduce<typeof APP_NAVIGATION>((acc, route) => {
        if (route.roles && (!user?.role || !route.roles.includes(user.role))) {
          return acc;
        }

        const children = route.children?.filter((child) => {
          if (!child.roles) return true;
          return user?.role && child.roles.includes(user.role);
        });

        acc.push({
          ...route,
          children,
        });
        return acc;
      }, []),
    [user]
  );

  const effectiveRoutes = useMemo(() => {
    if (user?.role !== 'DIVISION_MANAGER') return routes;

    const divisionManagerRoutes: typeof APP_NAVIGATION = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        group: 'overview',
      },
      {
        path: '/my-division/basics',
        label: 'Basics',
        icon: Info,
        group: 'operations',
      },
      {
        path: '/my-division/media',
        label: 'Media',
        icon: Image,
        group: 'operations',
      },
      {
        path: '/my-division/description',
        label: 'Description',
        icon: FileText,
        group: 'operations',
      },
      {
        path: '/my-division/extras',
        label: 'Extras',
        icon: Settings,
        group: 'operations',
      },
      {
        path: '/my-division/bookings',
        label: 'Bookings',
        icon: CalendarDays,
        group: 'operations',
      },
      {
        path: '/my-division/team',
        label: 'My Team',
        icon: Users,
        group: 'operations',
      },
      {
        path: '/notifications',
        label: 'Notifications',
        icon: Bell,
        group: 'overview',
      },
    ];

    if (myDivision?.requiresMedicalTeam) {
      divisionManagerRoutes.splice(4, 0, {
        path: '/my-division/medical-team',
        label: 'Medical Team',
        icon: Stethoscope,
        group: 'operations',
      });
    }

    return divisionManagerRoutes;
  }, [myDivision?.requiresMedicalTeam, routes, user?.role]);

  const groupedRoutes = useMemo(
    () => ({
      overview: effectiveRoutes.filter((route) => route.group === 'overview'),
      operations: effectiveRoutes.filter(
        (route) => route.group === 'operations'
      ),
      content: effectiveRoutes.filter((route) => route.group === 'content'),
      system: effectiveRoutes.filter((route) => route.group === 'system'),
    }),
    [effectiveRoutes]
  );

  const currentRoute = effectiveRoutes.find(
    (route) =>
      location.pathname === route.path ||
      route.children?.some((child) => child.path === location.pathname)
  );

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed left-0 right-0 top-0 z-50 h-px bg-slate-200/80" />

      <header className="z-40 h-16 shrink-0 border-b border-border/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-400 grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              aria-label="Toggle navigation menu"
              className="md:hidden"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              size="icon-sm"
              variant="ghost"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Collapse sidebar"
              className="hidden md:inline-flex"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              size="icon-sm"
              variant="ghost"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <Separator className="hidden h-5 md:block" orientation="vertical" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {currentRoute?.label ?? 'Liyana Admin'}
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                Operational control panel
              </p>
            </div>
          </div>

          <div className="hidden justify-center px-4 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <AppInput
                className="pl-9"
                placeholder="Command palette"
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="hidden text-sm text-slate-500 lg:inline">
              {user?.email}
            </span>
            <NotificationBell />
            <Button
              aria-label="Log out"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              size="sm"
              variant="outline"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid h-[calc(100vh-4rem)] max-w-400 min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr]">
        <aside
          className={cn(
            'group/sidebar hidden h-full min-h-0 border-r border-border/60 bg-white/60 p-3 backdrop-blur-md transition-all duration-300 md:block',
            isSidebarCollapsed ? 'w-20 hover:w-64' : 'w-72'
          )}
          data-collapsed={isSidebarCollapsed}
        >
          <div className="flex h-full min-h-0 flex-col rounded-2xl border border-border/70 bg-white/80 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <Link
              className={cn(
                'block shrink-0 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight text-slate-900 transition-opacity',
                isSidebarCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100'
              )}
              to="/"
            >
              Liyana Admin
            </Link>

            <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
              <nav
                className={cn(
                  'space-y-4 py-2',
                  isSidebarCollapsed && 'space-y-2'
                )}
              >
                <NavSection
                  collapsed={isSidebarCollapsed}
                  routes={groupedRoutes.overview}
                  title="Overview"
                />
                <NavSection
                  collapsed={isSidebarCollapsed}
                  routes={groupedRoutes.operations}
                  title="Operations"
                />
                <NavSection
                  collapsed={isSidebarCollapsed}
                  routes={groupedRoutes.content}
                  title="Content"
                />
                <NavSection
                  collapsed={isSidebarCollapsed}
                  routes={groupedRoutes.system}
                  title="System"
                />
              </nav>
            </div>
          </div>
        </aside>

        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsMobileNavOpen(false)}
              type="button"
            />
            <aside className="absolute left-0 top-0 flex h-full w-[84vw] max-w-sm min-h-0 flex-col border-r border-border/70 bg-white/90 p-4 backdrop-blur-md">
              <Link
                className="mb-4 block shrink-0 text-base font-semibold tracking-tight text-slate-900"
                onClick={() => setIsMobileNavOpen(false)}
                to="/"
              >
                Liyana Admin
              </Link>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
                <nav className="space-y-4">
                  <NavSection
                    onNavigate={() => setIsMobileNavOpen(false)}
                    routes={groupedRoutes.overview}
                    title="Overview"
                  />
                  <NavSection
                    onNavigate={() => setIsMobileNavOpen(false)}
                    routes={groupedRoutes.operations}
                    title="Operations"
                  />
                  <NavSection
                    onNavigate={() => setIsMobileNavOpen(false)}
                    routes={groupedRoutes.content}
                    title="Content"
                  />
                  <NavSection
                    onNavigate={() => setIsMobileNavOpen(false)}
                    routes={groupedRoutes.system}
                    title="System"
                  />
                </nav>
              </div>
            </aside>
          </div>
        ) : null}

        <main className="custom-scrollbar min-h-0 min-w-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-290 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

type NavSectionProps = {
  title: string;
  routes: typeof APP_NAVIGATION;
  collapsed?: boolean;
  onNavigate?: () => void;
};

function NavSection({
  title,
  routes,
  collapsed = false,
  onNavigate,
}: NavSectionProps) {
  if (!routes.length) return null;

  return (
    <div className="space-y-1">
      <p
        className={cn(
          'px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 transition-opacity',
          collapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100'
        )}
      >
        {title}
      </p>
      {routes.map((route) => {
        const Icon = route.icon;

        return (
          <div key={route.path} className="space-y-1">
            <NavLink
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm transition-all',
                  isActive
                    ? 'border-slate-200/80 bg-white text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                    : 'text-slate-500 hover:border-slate-200/60 hover:bg-white/80 hover:text-slate-900',
                  collapsed && 'justify-center px-2.5'
                )
              }
              end={!route.children?.length}
              onClick={onNavigate}
              to={route.path}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
              <span
                className={cn(
                  'truncate transition-opacity',
                  collapsed ? 'hidden group-hover/sidebar:inline' : 'inline'
                )}
              >
                {route.label}
              </span>
            </NavLink>

            {route.children?.length && !collapsed ? (
              <div className="ml-5 space-y-1 border-l border-border/80 pl-2">
                {route.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <NavLink
                      key={child.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                          isActive
                            ? 'bg-slate-100 font-medium text-slate-900'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        )
                      }
                      onClick={onNavigate}
                      to={child.path}
                    >
                      <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
