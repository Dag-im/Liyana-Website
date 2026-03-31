import type { MouseEventHandler, ReactElement } from 'react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import TooltipWrapper from '@/components/system/TooltipWrapper'

type IconButtonProps = {
  tooltip: string
  ariaLabel?: string
  icon: ReactElement<any>
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  destructive?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

function normalizeIcon(icon: ReactElement<any>) {
  const existing =
    typeof icon.props?.className === 'string' ? icon.props.className : ''
  return React.cloneElement(icon, {
    className: cn('h-4 w-4', existing),
  })
}

export default function IconButton({
  tooltip,
  ariaLabel,
  icon,
  onClick,
  disabled = false,
  destructive = false,
  type = 'button',
  className,
}: IconButtonProps) {
  const normalizedIcon = normalizeIcon(icon)
  const label = ariaLabel ?? tooltip

  return (
    <TooltipWrapper content={tooltip}>
      <button
        type={type}
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'h-9 w-9 flex items-center justify-center rounded-lg transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#009bd9]/20',
          'active:scale-[0.98] select-none',
          !destructive
            ? 'bg-transparent text-slate-600 hover:bg-slate-100'
            : 'bg-transparent text-red-600 hover:bg-red-50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        {normalizedIcon}
      </button>
    </TooltipWrapper>
  )
}
