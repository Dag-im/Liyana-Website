import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

import AppButton from '@/components/system/AppButton';

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = 'No data available',
  description = 'Nothing to show yet.',
  icon,
  actionLabel = 'Create item',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/90 bg-white/70 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-border/80">
        {icon ?? <SearchX className="h-5 w-5" />}
      </div>
      <p className="relative text-lg font-semibold text-slate-900">{title}</p>
      <p className="relative mt-1 max-w-sm text-sm text-slate-500">
        {description}
      </p>
      {onAction ? (
        <AppButton
          className="relative mt-5"
          onClick={onAction}
          size="default"
          variant="secondary"
        >
          {actionLabel}
        </AppButton>
      ) : null}
    </div>
  );
}
