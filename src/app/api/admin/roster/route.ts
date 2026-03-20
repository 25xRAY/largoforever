import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, requireStaffSession } from "@/lib/admin-session";
import { rosterEntryCreateSchema } from "@/lib/validations/roster-admin";
import { Prisma, UserRole } from "@prisma/client";
import { normalizeRosterEmail } from "@/lib/roster";
import { logger } from "@/lib/logger";

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * GET /api/admin/roster — list entries; ?used=true|false, ?role=, ?q=, ?format=csv
 * POST /api/admin/roster — add one entry (JSON)
 */
export async function GET(request: Request) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const { searchParams } = new URL(request.url);
  const usedParam = searchParams.get("used");
  const roleParam = searchParams.get("role") as UserRole | null;
  const q = searchParams.get("q")?.trim();
  const format = searchParams.get("format");

  const where: Prisma.ApprovedRosterWhereInput = {
    ...(usedParam === "true" ? { used: true } : {}),
    ...(usedParam === "false" ? { used: false } : {}),
    ...(roleParam && Object.values(UserRole).includes(roleParam) ? { role: roleParam } : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  try {
    const rows = await prisma.approvedRoster.findMany({
      where,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });

    if (format === "csv") {
      const header = "email,firstName,lastName,role,used";
      const lines = rows.map(
        (r) =>
          `${csvEscape(r.email)},${csvEscape(r.firstName)},${csvEscape(r.lastName)},${r.role},${r.used}`
      );
      const csv = [header, ...lines].join("\n");
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="approved-roster.csv"',
        },
      });
    }

    return NextResponse.json({ entries: rows });
  } catch (e) {
    logger.error("admin roster GET", { error: String(e) });
    return NextResponse.json({ error: "Failed to load roster" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  try {
    const body = await request.json();
    const parsed = rosterEntryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, firstName, lastName, role } = parsed.data;
    const emailNorm = normalizeRosterEmail(email);
    const entry = await prisma.approvedRoster.upsert({
      where: { email: emailNorm },
      create: {
        email: emailNorm,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      },
      update: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      },
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (e) {
    logger.error("admin roster POST", { error: String(e) });
    return NextResponse.json({ error: "Failed to save roster entry" }, { status: 500 });
  }
}
