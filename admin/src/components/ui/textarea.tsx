import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-base text-slate-700 transition-colors outline-none placeholder:text-slate-400 focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_rgba(0,155,217,0.2)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_rgba(220,38,38,0.2)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
