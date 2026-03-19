"use client";

import Link from "next/link";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react";

interface AlertsListProps {
  alerts: Alert[];
  maxVisible?: number;
}

function getIcon(priority: Alert["priority"]) {
  if (priority === "RED") return <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />;
  if (priority === "YELLOW") return <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />;
  return <Info className="h-5 w-5 shrink-0" aria-hidden />;
}

function getBorderClass(priority: Alert["priority"]) {
  if (priority === "RED") return "border-l-danger";
  if (priority === "YELLOW") return "border-l-warning";
  return "border-l-info";
}

const PRIORITY_RANK: Record<Alert["priority"], number> = {
  RED: 0,
  YELLOW: 1,
  GREEN: 2,
};

/**
 * Sorted critical → warning → info. Max 5 visible. Colored left border, icon, message, "Resolve →" link.
 */
export function AlertsList({ alerts, maxVisible = 5 }: AlertsListProps) {
  const sorted = [...alerts].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );
  const visible = sorted.slice(0, maxVisible);

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        heading="All clear"
        description="No action items right now. Keep up the great work!"
      />
    );
  }

  return (
    <ul className="space-y-2" role="list">
      {visible.map((alert) => (
        <li key={alert.id}>
          <div
            className={cn(
              "flex items-start gap-3 rounded-card border-l-4 bg-white p-4 shadow-card",
              getBorderClass(alert.priority)
            )}
          >
            <span
              className={
                alert.priority === "RED"
                  ? "text-danger"
                  : alert.priority === "YELLOW"
                    ? "text-warning"
                    : "text-info"
              }
            >
              {getIcon(alert.priority)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-navy-900">{alert.title}</p>
              <p className="mt-0.5 text-sm text-navy-600">{alert.message}</p>
              {alert.actionUrl && (
                <Link
                  href={alert.actionUrl}
                  className="mt-2 inline-block text-sm font-medium text-gold-600 hover:text-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  Resolve →
                </Link>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
