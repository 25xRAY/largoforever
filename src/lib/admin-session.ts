import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

/** Roles that can access `/admin/*` and most `/api/admin/*` routes. */
export const ADMIN_PANEL_ROLES: readonly UserRole[] = [
  "ADMIN",
  "ADMINISTRATOR",
  "MODERATOR",
  "COUNSELOR",
];

export function isAdminPanelRole(role: UserRole): boolean {
  return ADMIN_PANEL_ROLES.includes(role);
}

/** Can PATCH student records in admin (verified checklist edits). */
export function canEditStudentAdminRecords(role: UserRole): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}

/** Staff roles allowed in admin panel (view + actions per route). */
export async function requireStaffSession(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role;
  if (!isAdminPanelRole(role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, userId: session.user.id, role };
}

/** Bulk approved-roster CSV import: platform admin, school administrator, or counselor. */
const ROSTER_BULK_IMPORT_ROLES: readonly UserRole[] = [
  "ADMIN",
  "ADMINISTRATOR",
  "COUNSELOR",
];

export async function requireRosterBulkImportSession(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role;
  if (!ROSTER_BULK_IMPORT_ROLES.includes(role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, userId: session.user.id, role };
}

/** Platform (`ADMIN`) only — destructive / roster-of-record operations. */
export async function requireAdminSession(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, userId: session.user.id, role: session.user.role };
}
