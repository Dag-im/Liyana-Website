import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type OverviewCardProps = {
  title: string
  description: string
  icon: LucideIcon
  to: string
  meta?: string
}

export default function OverviewCard({
  title,
  description,
  icon: Icon,
  to,
  meta,
}: OverviewCardProps) {
  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
        <Button asChild size="sm" variant="outline">
          <Link to={to}>
            Open <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
