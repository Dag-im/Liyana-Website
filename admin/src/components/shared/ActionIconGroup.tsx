import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import TooltipWrapper from '@/components/system/TooltipWrapper'
import { Button } from '@/components/ui/button'

type ActionIcon = {
  label: string
  icon: LucideIcon
  onClick?: () => void
  to?: string
  variant?: 'ghost' | 'outline'
  destructive?: boolean
  disabled?: boolean
}

export default function ActionIconGroup({ actions }: { actions: ActionIcon[] }) {
  return (
    <div className="flex items-center gap-1">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <TooltipWrapper content={action.label} key={action.label}>
            <Button
              size="icon"
              type="button"
              variant={action.variant ?? 'ghost'}
              onClick={action.onClick}
              asChild={!!action.to}
              disabled={action.disabled}
            >
              {action.to ? (
                <Link to={action.to}>
                  <Icon
                    className={action.destructive ? 'h-4 w-4 text-destructive' : 'h-4 w-4'}
                  />
                </Link>
              ) : (
                <span>
                  <Icon
                    className={action.destructive ? 'h-4 w-4 text-destructive' : 'h-4 w-4'}
                  />
                </span>
              )}
            </Button>
          </TooltipWrapper>
        )
      })}
    </div>
  )
}
