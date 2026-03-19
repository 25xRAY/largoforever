import {
  getDashboardInvalidationKeys,
  getQueryClientDefaultOptions,
  QUERY_CLIENT_DEFAULTS,
} from "@/lib/cache";

describe("cache", () => {
  it("exposes React Query defaults", () => {
    expect(QUERY_CLIENT_DEFAULTS.queries?.staleTime).toBe(5 * 60 * 1000);
    expect(QUERY_CLIENT_DEFAULTS.queries?.gcTime).toBe(30 * 60 * 1000);
    expect(QUERY_CLIENT_DEFAULTS.queries?.retry).toBe(2);
  });

  it("getQueryClientDefaultOptions clones queries", () => {
    const o = getQueryClientDefaultOptions();
    expect(o.queries?.staleTime).toBe(5 * 60 * 1000);
  });

  it("returns invalidation key groups", () => {
    const keys = getDashboardInvalidationKeys();
    expect(keys.flat()).toContain("dashboard");
  });
});
