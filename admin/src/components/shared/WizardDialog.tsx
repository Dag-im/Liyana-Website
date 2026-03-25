import * as React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

export type WizardStep = {
  id: number
  title: string
  description?: string
  icon?: LucideIcon
}

export interface WizardDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  steps: readonly WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  draftSavedAt?: Date | null;
  className?: string;
  contentClassName?: string;
  inline?: boolean;
}

export function WizardDialog({
  open,
  onOpenChange,
  title,
  description,
  steps,
  currentStep,
  onStepClick,
  children,
  footer,
  draftSavedAt,
  className,
  contentClassName,
  inline = false,
}: WizardDialogProps) {
  const shell = (
    <>
      <div className="space-y-4 border-b bg-background p-6 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {draftSavedAt && (
              <Badge variant="secondary" className="font-normal animate-in fade-in zoom-in-95 duration-300">
                Draft saved {draftSavedAt.toLocaleTimeString()}
              </Badge>
            )}
            <Badge variant="outline" className="font-semibold bg-primary/5 border-primary/20">
              Step {currentStep} / {steps.length}
            </Badge>
          </div>
        </div>
        
        {/* Inlined WizardProgress */}
        <div className="flex w-full items-center justify-between px-2 pt-2">
          {steps.map((stepItem, idx) => {
            const isCompleted = stepItem.id < currentStep
            const isActive = stepItem.id === currentStep
            const isLast = idx === steps.length - 1
            const Icon = stepItem.icon

            return (
              <React.Fragment key={stepItem.id}>
                <div 
                  className={cn(
                    "group flex flex-col items-center gap-2 transition-all duration-300",
                    onStepClick && "cursor-pointer"
                  )}
                  onClick={() => onStepClick?.(stepItem.id)}
                >
                  <div 
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300",
                      isCompleted && "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10",
                      isActive && "border-primary text-primary shadow-sm shadow-primary/10 ring-4 ring-primary/10 scale-110",
                      !isCompleted && !isActive && "border-muted bg-background text-muted-foreground group-hover:border-muted-foreground/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 animate-in zoom-in duration-300" />
                    ) : Icon ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{stepItem.id}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span 
                      className={cn(
                        "text-xs font-bold transition-colors duration-300",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-muted-foreground/80"
                      )}
                    >
                      {stepItem.title}
                    </span>
                    {stepItem.description && (
                      <span className="hidden text-[10px] text-muted-foreground/60 md:block">
                        {stepItem.description}
                      </span>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-4 h-[2px] flex-1 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full bg-primary transition-all duration-500 ease-in-out",
                        isCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className={cn("custom-scrollbar flex-1 overflow-y-auto bg-background/50 p-8", contentClassName)}>
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </div>

      <div className="mt-0 border-t bg-muted/30 p-6 shrink-0 flex items-center justify-between">
        {footer}
      </div>
    </>
  )

  if (inline) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm",
          className
        )}
      >
        {shell}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "flex max-h-[94vh] w-[96vw] max-w-[1440px] flex-col overflow-hidden p-0 gap-0 border-none shadow-sm",
          className
        )}
      >
        {shell}
      </DialogContent>
    </Dialog>
  );
}
