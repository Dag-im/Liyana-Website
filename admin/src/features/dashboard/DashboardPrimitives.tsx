import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DashboardHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  chips?: string[];
  actions?: { label: string; to: string; variant?: 'default' | 'outline' }[];
};

export function DashboardHero({
  eyebrow,
  title,
  description,
  chips,
  actions,
}: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-slate-100 shadow-lg">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/90">
          {eyebrow}
        </p>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 md:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {chips?.map((chip) => (
            <Badge
              key={chip}
              className="border-white/15 bg-white/10 text-slate-100 hover:bg-white/15"
              variant="secondary"
            >
              {chip}
            </Badge>
          ))}
        </div>
        {actions?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {actions.map((action) => (
              <Button
                key={`${action.to}-${action.label}`}
                asChild
                className={cn(
                  action.variant === 'outline'
                    ? 'border-white/25 bg-white/5 text-white hover:bg-white/10'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                )}
                variant={action.variant === 'outline' ? 'outline' : 'default'}
              >
                <Link to={action.to}>{action.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  tone?: 'default' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
  to?: string;
};

const toneMap: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'bg-slate-500/10 text-slate-700',
  cyan: 'bg-cyan-500/10 text-cyan-700',
  emerald: 'bg-emerald-500/10 text-emerald-700',
  amber: 'bg-amber-500/10 text-amber-700',
  rose: 'bg-rose-500/10 text-rose-700',
  indigo: 'bg-indigo-500/10 text-indigo-700',
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'default',
  to,
}: MetricCardProps) {
  return (
    <Card className="group border-border/70 bg-card/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={cn('rounded-lg p-2 transition-colors', toneMap[tone])}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
        {to ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 px-0 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link to={to}>
              View details <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

type SectionCardProps = {
  title: string;
  description?: string;
  action?: { label: string; to: string };
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card
      className={cn('border-border/70 bg-card/70 backdrop-blur', className)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {action ? (
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

type QuickActionProps = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export function QuickActionGrid({ actions }: { actions: QuickActionProps[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {actions.map((action) => (
        <Button
          key={action.to}
          asChild
          variant="outline"
          className="h-10 justify-start gap-2 rounded-lg border-border/70"
        >
          <Link to={action.to}>
            <action.icon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{action.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
