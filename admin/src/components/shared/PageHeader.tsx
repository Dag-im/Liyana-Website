import type { ReactNode } from 'react'

type PageHeaderProps = {
  title?: string // Legacy
  heading?: string
  text?: string
  children?: ReactNode
  eyebrow?: string
}

export default function PageHeader({ title, heading, text, children, eyebrow }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-5">
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-[1.75rem]">{heading || title}</h1>
        {text ? <p className="max-w-2xl text-sm text-muted-foreground">{text}</p> : null}
      </div>
      {children ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {children}
        </div>
      ) : null}
    </header>
  )
}
