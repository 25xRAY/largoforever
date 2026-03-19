import { test, expect } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page);
    if (!page.url().includes("/dashboard")) {
      await page.goto("/dashboard");
    }
  });

  test("dashboard loads with readiness meter and action sections", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole("meter", { name: /readiness:/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Action items" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quick actions" })).toBeVisible();
  });

  test("quick action navigates to checklist", async ({ page }) => {
    await page.getByRole("link", { name: /view checklist/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/checklist/);
  });
});
