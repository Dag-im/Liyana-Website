import { Eye } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';

export default function BookingsComingSoonPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        heading="Bookings"
        text="The booking queue is coming soon. We'll enable filtering, status updates, and details soon."
      />

      <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-white/70 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] font-semibold tracking-tight text-slate-400">
            L
          </div>
        </div>

        <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-border/80">
          <Eye className="h-5 w-5 text-slate-500" />
        </div>

        <p className="relative z-10 text-lg font-semibold text-slate-900">
          Coming Soon
        </p>
        <p className="relative z-10 mt-2 max-w-md text-sm text-slate-600">
          In the meantime, use <span className="font-medium">My Division</span>{' '}
          bookings for ongoing requests.
        </p>
      </div>
    </div>
  );
}
