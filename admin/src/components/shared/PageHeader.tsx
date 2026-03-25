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
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6">
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="aura-label text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="aura-heading text-balance text-2xl md:text-[1.9rem]">{heading || title}</h1>
        {text ? <p className="aura-body max-w-2xl text-sm">{text}</p> : null}
      </div>
      {children ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {children}
        </div>
      ) : null}
    </header>
  )
}
