"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
  "w-full rounded-button border-2 bg-white px-4 py-3 font-body text-navy-900 transition-colors placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-navy-200 focus:border-gold-500",
        error: "border-danger focus:border-danger focus:ring-danger",
        success: "border-success focus:border-success focus:ring-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

/**
 * Styled text input with optional floating label, helper, error, password toggle, character counter.
 * aria-describedby for helper/error, aria-invalid on error.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      label,
      helperText,
      errorMessage,
      maxLength,
      showCharCount = false,
      type: typeProp = "text",
      id: idProp,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(
      typeof props.value === "string" ? props.value : (props.defaultValue ?? "")
    );
    const isControlled = props.value !== undefined;
    const currentLength = isControlled
      ? (typeof props.value === "string" ? props.value : "").length
      : (value as string).length;

    const id = idProp ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const isPassword = typeProp === "password";
    const type = isPassword ? (showPassword ? "text" : "password") : typeProp;
    const hasError = Boolean(errorMessage) || variant === "error";
    const resolvedVariant = errorMessage ? "error" : variant;

    const descIds = [helperText && `${id}-helper`, errorMessage && `${id}-error`].filter(Boolean);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1 block font-body text-sm font-medium text-navy-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(inputVariants({ variant: resolvedVariant, className }))}
            aria-describedby={descIds.length > 0 ? descIds.join(" ") : undefined}
            aria-invalid={hasError}
            maxLength={maxLength}
            {...props}
            value={isControlled ? props.value : value}
            onChange={(e) => {
              props.onChange?.(e);
              if (!isControlled) setValue(e.target.value);
            }}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 rounded p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {(helperText || errorMessage) && (
          <p
            id={errorMessage ? `${id}-error` : `${id}-helper`}
            className={cn("mt-1 text-sm", errorMessage ? "text-danger" : "text-navy-600")}
          >
            {errorMessage ?? helperText}
          </p>
        )}
        {showCharCount && maxLength != null && (
          <p className="mt-1 text-right text-sm text-navy-500" aria-live="polite">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
