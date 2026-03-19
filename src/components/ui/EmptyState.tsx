"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Centered layout: icon + heading + description + optional CTA. Used when lists are empty.
 */
export function EmptyState({
  icon: Icon,
  heading,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border-2 border-dashed border-navy-200 bg-navy-50/50 p-8 text-center",
        className
      )}
      role="status"
      aria-label={`${heading}. ${description}`}
    >
      <Icon
        className="mb-4 h-12 w-12 text-navy-400"
        aria-hidden
      />
      <h3 className="font-heading text-lg font-semibold text-navy-800">{heading}</h3>
      <p className="mt-2 max-w-sm text-sm text-navy-600">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Button asChild variant="primary" size="md">
              <a href={actionHref} rel="noopener noreferrer">
                {actionLabel}
              </a>
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
