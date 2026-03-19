import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/wall-of-wins",
  "/yearbook",
  "/resources",
  "/leaderboards",
] as const;

test.describe("Accessibility", () => {
  for (const path of PUBLIC_PATHS) {
    test(`no critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
