import {
  ArrowLeft,
  Compass,
  FileSearch,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/useAuth';

type RecoveryLink = {
  label: string;
  description: string;
  to: string;
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const authQuery = useAuth();
  const role = authQuery.data?.role;

  const recoveryLinks = getRecoveryLinks(role);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Error 404"
        heading="Page Not Found"
        text="The admin route you requested does not exist, may have moved, or you may not have access to it with the current role."
      >
        <Button onClick={() => navigate(-1)} type="button" variant="outline">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button asChild>
          <Link to={role === 'DIVISION_MANAGER' ? '/dashboard' : '/'}>
            <LayoutDashboard className="h-4 w-4" />
            Open Dashboard
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-border/80 bg-slate-50 text-slate-700">
                <FileSearch className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle>We couldn&apos;t resolve this route</CardTitle>
                <CardDescription>
                  Check the path below, then choose one of the suggested
                  destinations to continue.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Requested Path
              </p>
              <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                {location.pathname}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoTile
                label="Likely Cause"
                value="Moved or removed page"
                description="This admin area may have been replaced during the routing refactor."
              />
              <InfoTile
                label="Access Check"
                value={role ?? 'Unknown role'}
                description="Some routes are only available to specific roles."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => navigate(-1)}
                type="button"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Previous Page
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">
                  <RefreshCw className="h-4 w-4" />
                  Start From Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center border border-border/80 bg-cyan-50 text-cyan-700">
                <Compass className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle>Recommended Destinations</CardTitle>
                <CardDescription>
                  Common recovery routes based on your current admin access.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {recoveryLinks.map((item) => (
              <Link
                key={item.to}
                className="block border border-border/70 bg-white px-4 py-3 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                to={item.to}
              >
                <p className="text-sm font-medium text-slate-900">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border border-border/70 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function getRecoveryLinks(role?: string): RecoveryLink[] {
  const shared: RecoveryLink[] = [
    {
      label: 'Dashboard',
      description: 'Return to the main operational overview.',
      to: '/dashboard',
    },
    {
      label: 'Notifications',
      description: 'Review alerts, approvals, and recent activity.',
      to: '/notifications',
    },
  ];

  if (role === 'DIVISION_MANAGER') {
    return [
      ...shared,
      {
        label: 'Division Basics',
        description: 'Manage the primary profile details for your division.',
        to: '/my-division/basics',
      },
      {
        label: 'Division Media',
        description: 'Update logo, images, and gallery assets.',
        to: '/my-division/media',
      },
    ];
  }

  if (role === 'LUCS_ADMIN') {
    return [
      ...shared,
      {
        label: 'LUCS Overview',
        description: 'Go back to the LUCS section directory.',
        to: '/lucs-admin',
      },
      {
        label: 'LUCS Inquiries',
        description: 'Review submitted LUCS inquiries and mark them handled.',
        to: '/lucs-admin/inquiries',
      },
    ];
  }

  return [
    ...shared,
    {
      label: 'CMS Directory',
      description: 'Open the core content management section.',
      to: '/cms',
    },
    {
      label: 'Investor Relations',
      description: 'Jump into the IR routed admin pages.',
      to: '/ir-admin',
    },
    {
      label: 'ESG',
      description: 'Open the ESG content directory and section pages.',
      to: '/esg-admin',
    },
  ];
}
