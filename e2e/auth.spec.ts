import { test, expect } from "@playwright/test";
import { loginAsStudent } from "./helpers/auth";

test.describe("Authentication", () => {
  test("redirects unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login shows error for wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("student1@students.pgcps.org");
    await page.getByLabel("Password").fill("WrongPass1!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toContainText(/invalid|password/i);
  });

  test("full registration flow creates account and reaches onboarding", async ({ page }) => {
    const unique = `${Date.now()}-${test.info().workerIndex}`;
    await page.goto("/register");
    await page.getByLabel("First name").fill("Play");
    await page.getByLabel("Last name").fill("Wright");
    await page.getByLabel("Email", { exact: true }).fill(`e2e.${unique}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill("SecurePass1!");
    await page.getByLabel("Confirm password").fill("SecurePass1!");
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 30_000 });
  });

  test("login flow reaches dashboard for seeded student", async ({ page }) => {
    await loginAsStudent(page);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("logout returns to home", async ({ page }) => {
    await loginAsStudent(page);
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByText("Sign Out", { exact: true }).click();
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
