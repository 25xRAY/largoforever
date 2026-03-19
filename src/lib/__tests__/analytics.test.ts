/**
 * @jest-environment jsdom
 */
import { isAnalyticsEnabled, reportWebVitalsToAnalytics, trackCustomEvent } from "@/lib/analytics";

describe("analytics", () => {
  const originalGtag = window.gtag;
  const originalGa = process.env.NEXT_PUBLIC_GA_ID;

  afterEach(() => {
    window.gtag = originalGtag;
    process.env.NEXT_PUBLIC_GA_ID = originalGa;
    jest.restoreAllMocks();
  });

  it("isAnalyticsEnabled is false without gtag", () => {
    delete window.gtag;
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST";
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("trackCustomEvent no-ops without gtag", () => {
    delete window.gtag;
    expect(() => trackCustomEvent("page_view")).not.toThrow();
  });

  it("trackCustomEvent calls gtag when present", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST";
    trackCustomEvent("win_submitted", { ok: "true" });
    expect(gtag).toHaveBeenCalledWith("event", "win_submitted", { ok: "true" });
  });

  it("reportWebVitalsToAnalytics forwards metric", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST";
    reportWebVitalsToAnalytics({ id: "v1", name: "LCP", value: 1200 });
    expect(gtag).toHaveBeenCalled();
  });
});
