import { test, expect } from "@playwright/test";

test.describe("Yearbook", () => {
  test("browse page loads hero and search", async ({ page }) => {
    await page.goto("/yearbook");
    await expect(
      page.getByRole("heading", { name: /class of 2026 digital yearbook/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("individual yearbook page renders from browse", async ({ page }) => {
    await page.goto("/yearbook");
    const firstCard = page.locator('main a[href^="/yearbook/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 30_000 });
    const href = await firstCard.getAttribute("href");
    expect(href).toBeTruthy();
    await firstCard.click();
    await expect(page).toHaveURL(/\/yearbook\/[a-z0-9-]+/i);
    await expect(page.locator("main")).toBeVisible();
  });
});
