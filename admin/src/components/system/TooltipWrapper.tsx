import type { ReactElement } from 'react'

type TooltipWrapperProps = {
  content: string
  children: ReactElement
}

// Production fallback tooltip: uses native `title` so we don't introduce
// new tooltip dependencies. Works for both enabled and disabled elements
// because the title is on the wrapper.
export default function TooltipWrapper({
  content,
  children,
}: TooltipWrapperProps) {
  return (
    <span className="inline-flex" title={content}>
      {children}
    </span>
  )
}

