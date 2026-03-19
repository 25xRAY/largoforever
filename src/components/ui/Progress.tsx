"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0–100. Color: danger (0–49), warning (50–74), success (75–100). */
  value?: number;
  showLabel?: boolean;
}

function getProgressColor(value: number): string {
  if (value >= 75) return "bg-success";
  if (value >= 50) return "bg-warning";
  return "bg-danger";
}

/**
 * Radix Progress. Color auto-switches by value. Animated fill. aria-valuenow/min/max. Optional percentage label.
 */
const Progress = forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, showLabel = false, ...props }, ref) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color = getProgressColor(clamped);

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-3 w-full overflow-hidden rounded-full bg-navy-100", className)}
        value={clamped}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full transition-all duration-500 ease-out", color)}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <p className="mt-1 text-sm font-medium text-navy-700" aria-hidden>
          {Math.round(clamped)}%
        </p>
      )}
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
