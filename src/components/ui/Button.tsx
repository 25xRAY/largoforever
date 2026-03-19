"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-heading font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-gold-500 text-navy-900 hover:bg-gold-400 active:bg-gold-600",
        secondary: "bg-navy-500 text-white hover:bg-navy-600 active:bg-navy-700",
        outline:
          "border-2 border-navy-500 bg-transparent text-navy-500 hover:bg-navy-50 active:bg-navy-100",
        ghost: "bg-transparent text-navy-700 hover:bg-navy-50 active:bg-navy-100",
        danger: "bg-danger text-white hover:bg-danger-dark active:opacity-90",
        link: "bg-transparent text-navy-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-button px-3 text-sm",
        md: "h-10 rounded-button px-4 text-base",
        lg: "h-12 rounded-button px-6 text-lg",
        xl: "h-14 rounded-button px-8 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Accessible button with CVA variants. Focus ring gold. Supports asChild (Slot), loading state, icons.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const content =
      asChild && !isLoading ? (
        children
      ) : isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {loadingText ?? (typeof children === "string" ? children : "Loading...")}
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="[&>svg]:h-4 [&>svg]:w-4" aria-hidden>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className="[&>svg]:h-4 [&>svg]:w-4" aria-hidden>
              {rightIcon}
            </span>
          )}
        </>
      );

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled ?? isLoading}
        {...(props as Record<string, unknown>)}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
