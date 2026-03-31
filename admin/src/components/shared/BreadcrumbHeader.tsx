import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import PageHeader from '@/components/shared/PageHeader'

type BreadcrumbItem = {
  label: string
  to?: string
}

type BreadcrumbHeaderProps = {
  heading: string
  text?: string
  items: BreadcrumbItem[]
  actions?: React.ReactNode
}

export default function BreadcrumbHeader({
  heading,
  text,
  items,
  actions,
}: BreadcrumbHeaderProps) {
  return (
    <div className="space-y-3">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <span className="flex items-center gap-1" key={`${item.label}-${index}`}>
            {item.to ? (
              <Link className="transition-colors hover:text-foreground" to={item.to}>
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          </span>
        ))}
      </nav>
      <PageHeader heading={heading} text={text}>
        {actions}
      </PageHeader>
    </div>
  )
}
