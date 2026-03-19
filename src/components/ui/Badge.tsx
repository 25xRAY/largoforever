"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center font-body font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 rounded-badge",
  {
    variants: {
      variant: {
        default: "bg-navy-500 text-white",
        success: "bg-success-light text-success-dark",
        warning: "bg-warning-light text-warning-dark",
        danger: "bg-danger-light text-danger-dark",
        info: "bg-info-light text-info-dark",
        gold: "bg-gold-100 text-gold-900",
        outline: "border-2 border-navy-500 bg-transparent text-navy-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size">,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Badge with CVA variants. Optional dismissible with X button. Accessible.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        role={dismissible ? "group" : undefined}
        className={cn(badgeVariants({ variant, size }), "gap-1", className)}
        {...props}
      >
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-0.5 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-500"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
