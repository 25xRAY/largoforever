"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CRISIS_RESOURCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CrisisBannerProps {
  /** If true, always expanded (e.g. homepage). Default: collapsible with persisted state. */
  alwaysExpanded?: boolean;
  /** Optional class for wrapper. */
  className?: string;
}

/**
 * Collapsible crisis resources banner. Red gradient, 988 + 741741. Persists collapse state. Renders on every authenticated page.
 */
export function CrisisBanner({ alwaysExpanded = false, className }: CrisisBannerProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("crisis-banner-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const isExpanded = alwaysExpanded || !collapsed;

  const toggle = () => {
    if (alwaysExpanded) return;
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("crisis-banner-collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div
      className={cn("bg-gradient-to-r from-danger to-danger-dark text-white", className)}
      role="region"
      aria-label="Crisis resources"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">If you or someone you know is in crisis:</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`tel:${CRISIS_RESOURCES.nationalSuicide.number}`}
              className="font-semibold underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              {CRISIS_RESOURCES.nationalSuicide.text} — {CRISIS_RESOURCES.nationalSuicide.number}
            </a>
            <a
              href={CRISIS_RESOURCES.crisisTextLine.url}
              rel="noopener noreferrer"
              target="_blank"
              className="font-semibold underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              {CRISIS_RESOURCES.crisisTextLine.text} — {CRISIS_RESOURCES.crisisTextLine.number}
            </a>
          </div>
          {!alwaysExpanded && (
            <button
              type="button"
              onClick={toggle}
              className="rounded p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse crisis resources" : "Expand crisis resources"}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
