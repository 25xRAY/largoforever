import type { DefaultOptions } from "@tanstack/react-query";

/**
 * React Query defaults for the app shell: stale 5m, gc 30m, two retries on failure.
 */
export const QUERY_CLIENT_DEFAULTS: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  },
};

/**
 * Returns defaultOptions block suitable for `new QueryClient({ defaultOptions })`.
 */
export function getQueryClientDefaultOptions(): DefaultOptions {
  return {
    queries: { ...QUERY_CLIENT_DEFAULTS.queries },
  };
}

/**
 * Call after admin or moderator mutations that should refresh student dashboards.
 */
export function getDashboardInvalidationKeys(): readonly string[][] {
  return [["dashboard"], ["checklist"], ["yearbook-me"]] as const;
}
