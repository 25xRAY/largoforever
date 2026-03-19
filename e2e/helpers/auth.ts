import type { Page } from "@playwright/test";

const DEFAULT_STUDENT_EMAIL = "student1@students.pgcps.org";
const DEFAULT_STUDENT_PASSWORD = "ChangeMe123!";
const DEFAULT_ADMIN_EMAIL = "admin@largolions2026.org";
const DEFAULT_ADMIN_PASSWORD = "ChangeMe123!";

/**
 * Signs in with seeded student credentials (see prisma/seed.ts).
 */
export async function loginAsStudent(
  page: Page,
  email: string = process.env.E2E_STUDENT_EMAIL ?? DEFAULT_STUDENT_EMAIL,
  password: string = process.env.E2E_STUDENT_PASSWORD ?? DEFAULT_STUDENT_PASSWORD
): Promise<void> {
  await page.goto("/login");
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Sign in", exact: true }) });
  await form.locator('input[name="email"]').fill(email);
  await form.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30_000 });
}

/**
 * Signs in with seeded admin credentials (`admin@largolions2026.org` in prisma/seed.ts).
 */
export async function loginAsAdmin(
  page: Page,
  email: string = process.env.E2E_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
  password: string = process.env.E2E_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD
): Promise<void> {
  await page.goto("/login");
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Sign in", exact: true }) });
  await form.locator('input[name="email"]').fill(email);
  await form.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(/\/(dashboard|admin)/, { timeout: 30_000 });
}
