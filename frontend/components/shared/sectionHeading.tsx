import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const sectionHeadingVariants = cva(
  'font-semibold tracking-tight text-foreground',
  {
    variants: {
      variant: {
        default: 'text-3xl md:text-4xl lg:text-5xl',
        large: 'text-4xl md:text-5xl lg:text-6xl',
        medium: 'text-2xl md:text-3xl lg:text-4xl',
        small: 'text-xl md:text-2xl lg:text-3xl',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'left',
      weight: 'semibold',
    },
  }
);

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionHeadingVariants> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

const SectionHeading = React.forwardRef<
  HTMLHeadingElement,
  SectionHeadingProps
>(
  (
    {
      className,
      variant,
      align,
      weight,
      as: Component = 'h2',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          sectionHeadingVariants({ variant, align, weight, className })
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading, sectionHeadingVariants };
