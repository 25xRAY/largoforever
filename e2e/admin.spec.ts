import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("Admin panel smoke", () => {
  test("staff user reaches /admin and sees dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole("heading", { name: "Admin dashboard" })).toBeVisible();
    await expect(page.getByRole("aside", { name: "Admin sidebar" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Admin navigation" })).toBeVisible();
  });
});
