import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Minimal underline input (Aura spec): subtle border + Aura focus ring
        "h-10 w-full min-w-0 rounded-xl border-0 border-b border-border/60 bg-white px-3 py-2 text-base text-slate-700 transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700 placeholder:text-slate-400 focus-visible:shadow-[0_0_0_3px_rgba(0,155,217,0.2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 aria-invalid:border-b-destructive aria-invalid:shadow-[0_0_0_3px_rgba(220,38,38,0.2)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
