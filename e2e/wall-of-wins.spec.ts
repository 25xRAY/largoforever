import { test, expect } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Wall of Wins", () => {
  test("browse loads hero and filters", async ({ page }) => {
    await page.goto("/wall-of-wins");
    await expect(page.getByRole("heading", { name: "Wall of Wins" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Scholarships" })).toBeVisible();
  });

  test("filter tab updates URL", async ({ page }) => {
    await page.goto("/wall-of-wins");
    await page.getByRole("button", { name: "Scholarships" }).click();
    await expect(page).toHaveURL(/type=SCHOLARSHIP/);
  });

  test("search submits and reflects in URL", async ({ page }) => {
    await page.goto("/wall-of-wins");
    await page.locator('input[name="search"]').fill("merit");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/search=/);
  });

  test("submit wizard surfaces validation after submit attempt", async ({ page }) => {
    await loginAsStudent(page);
    await page.goto("/dashboard/wall-of-wins/submit");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Submit for review" }).click();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText(/title is required|required/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
