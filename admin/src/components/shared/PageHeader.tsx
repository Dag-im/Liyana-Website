import type { ReactNode } from 'react'

type PageHeaderProps = {
  title?: string // Legacy
  heading?: string
  text?: string
  children?: ReactNode
}

export default function PageHeader({ title, heading, text, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{heading || title}</h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
