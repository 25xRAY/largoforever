"use client";

import { cn } from "@/lib/utils";

const skeletonVariants = {
  text: "h-4 rounded",
  circle: "rounded-full",
  rect: "rounded-card",
} as const;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof skeletonVariants;
}

/**
 * Animated shimmer placeholder. Variants: text (lines), circle (avatar), rect (card). Accept className for custom sizing.
 */
function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-navy-200",
        skeletonVariants[variant],
        "animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-navy-200 via-navy-100 to-navy-200",
        className
      )}
      aria-hidden
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
