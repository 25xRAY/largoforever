/** Normalize roster / auth emails (lowercase, trim). */
export function normalizeRosterEmail(email: string): string {
  return email.toLowerCase().trim();
}
