import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#009bd9] text-white hover:bg-[#0187c0] shadow-none focus-visible:ring-ring/40",
        outline:
          "border-border/80 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        secondary:
          "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
        ghost:
          "text-slate-600 hover:bg-slate-100",
        destructive:
          "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:border-red-200 focus-visible:ring-[#009bd9]/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-10 gap-1 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 rounded-lg px-3 text-[0.82rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-5 text-sm",
        icon: "h-9 w-9",
        "icon-xs": "h-9 w-9 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // `base-ui` passes through DOM drag handlers, which can conflict with framer-motion's
    // internal pan/drag typing. Casting at the motion boundary keeps runtime identical
    // while allowing TypeScript to compile.
    const MotionButton = motion(ButtonPrimitive as unknown as React.ComponentType<any>)
    const MotionSlot = motion(Slot as unknown as React.ComponentType<any>)
    const Comp = asChild ? MotionSlot : MotionButton

    const isIconOnly =
      typeof size === 'string' && size.startsWith('icon') && size !== 'default'

    // Production hardening: ensure icon-only buttons have a tooltip.
    // If the caller didn't set `title`, we reuse `aria-label` (when present).
    const titleFromProps = (props as any).title as unknown
    const ariaLabelFromProps = (props as any)['aria-label'] as unknown

    const computedTitle =
      isIconOnly && typeof titleFromProps !== 'string' && typeof ariaLabelFromProps === 'string'
        ? ariaLabelFromProps
        : (typeof titleFromProps === 'string' ? titleFromProps : undefined)

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileTap={{ scale: 0.98 }}
        title={computedTitle}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
