/**
 * GA4 + Web Vitals hooks. No-op when `NEXT_PUBLIC_GA_ID` is unset or `gtag` missing.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type CustomAnalyticsEvent =
  | "page_view"
  | "win_submitted"
  | "yearbook_created"
  | "ed_roniq_chat";

/**
 * Whether GA4 should receive events (client + ID configured).
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(process.env.NEXT_PUBLIC_GA_ID && typeof window.gtag === "function");
}

/**
 * Fire a GA4 custom event (safe no-op server-side or without gtag).
 */
export function trackCustomEvent(
  name: CustomAnalyticsEvent,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

export interface WebVitalMetric {
  id: string;
  name: "CLS" | "FID" | "LCP" | "FCP" | "TTFB" | string;
  value: number;
}

/**
 * Report a Web Vitals metric to GA4 (or extend for other sinks).
 */
export function reportWebVitalsToAnalytics(metric: WebVitalMetric): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.value,
  });
}
