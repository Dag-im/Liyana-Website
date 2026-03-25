import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import TooltipWrapper from '@/components/system/TooltipWrapper';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  to: string;
  label: string;
  Icon: LucideIcon;
  collapsed: boolean;
  onNavigate?: () => void;
  variant?: 'primary' | 'child';
  comingSoon?: boolean;
  end?: boolean;
};

export default function SidebarItem({
  to,
  label,
  Icon,
  collapsed,
  onNavigate,
  variant = 'primary',
  comingSoon = false,
  end = true,
}: SidebarItemProps) {
  const isChild = variant === 'child';

  const baseClasses = cn(
    'relative flex items-center gap-2 rounded-md transition-colors duration-200 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-[#009bd9]/20',
    isChild ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
    collapsed && !isChild ? 'justify-center px-2.5' : '',
    !isChild ? 'hover:bg-slate-100' : 'hover:bg-slate-100'
  );

  if (comingSoon) {
    const content = (
      <div className={cn(baseClasses, 'cursor-not-allowed text-slate-300')}>
        <Icon className="h-5 w-5 shrink-0 text-slate-300" />
        {!collapsed || isChild ? (
          <span className="truncate">{label}</span>
        ) : null}
        {!collapsed && isChild ? (
          <span className="ml-auto text-[10px] text-slate-400">Soon</span>
        ) : null}
      </div>
    );

    return <TooltipWrapper content="Coming Soon">{content}</TooltipWrapper>;
  }

  const link = (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          baseClasses,
          isActive
            ? cn(
                'bg-[#009bd9]/10 text-[#009bd9]',
                // Active left indicator
                "before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.75 before:rounded-full before:bg-[#009bd9]",
                // Ensure indicator doesn't overlap the icon too much
                isChild ? 'pl-3' : 'pl-6'
              )
            : 'text-slate-600'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0 transition-transform group-hover/sidebar:scale-105" />
      {!collapsed || isChild ? (
        <span
          className={cn(
            'truncate transition-opacity',
            collapsed && !isChild ? 'hidden' : 'inline'
          )}
        >
          {label}
        </span>
      ) : null}
    </NavLink>
  );

  // Tooltip only when collapsed (icons-only mode)
  return collapsed && !isChild ? (
    <TooltipWrapper content={label}>{link}</TooltipWrapper>
  ) : (
    link
  );
}
