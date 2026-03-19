import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format number as USD. Handles null/undefined/NaN.
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Format date for display. Handles null/undefined/Invalid Date.
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (value == null) return "";
  const d = typeof value === "object" && "getTime" in value ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Format number as percentage. Handles null/undefined/NaN.
 */
export function formatPercentage(value: number | null | undefined, decimals = 0): string {
  if (value == null || Number.isNaN(value)) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Truncate text to max length with ellipsis. Handles null/undefined.
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (text == null) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + "...";
}

/**
 * Generate URL-safe slug from string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get initials from name (e.g. "Jane Doe" -> "JD"). Handles null/empty.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Map readiness percentage to semantic color for UI.
 */
export function getReadinessColor(
  percent: number | null | undefined
): "danger" | "warning" | "success" {
  if (percent == null || Number.isNaN(percent)) return "danger";
  if (percent >= 100) return "success";
  if (percent >= 70) return "success";
  if (percent >= 40) return "warning";
  return "danger";
}

/**
 * Map alert type to priority for ordering/sorting.
 */
export function getAlertPriority(priority: "GREEN" | "YELLOW" | "RED"): number {
  switch (priority) {
    case "RED":
      return 3;
    case "YELLOW":
      return 2;
    case "GREEN":
      return 1;
    default:
      return 0;
  }
}
