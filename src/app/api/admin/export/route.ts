import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import { adminExportSchema } from "@/lib/validations/admin";

function csvEscape(s: string | number | boolean | null | undefined): string {
  const v = s == null ? "" : String(s);
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

/**
 * POST /api/admin/export — returns JSON payload or CSV text (Content-Type set).
 */
export async function POST(request: Request) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminExportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { type, dateRange } = parsed.data;
  const from = dateRange ? new Date(dateRange.from) : null;
  const to = dateRange ? new Date(dateRange.to) : null;

  if (type === "students") {
    const rows = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        displayGpa: true,
        createdAt: true,
      },
    });
    const header = ["id", "email", "firstName", "lastName", "role", "displayGpa", "createdAt"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [r.id, r.email, r.firstName, r.lastName, r.role, r.displayGpa, r.createdAt.toISOString()]
          .map(csvEscape)
          .join(",")
      ),
    ];
    return new NextResponse(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="students.csv"',
      },
    });
  }

  if (type === "wins") {
    const rows = await prisma.win.findMany({
      where: {
        deletedAt: null,
        ...(from && to ? { createdAt: { gte: from, lte: to } } : {}),
      },
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        amount: true,
        approved: true,
        createdAt: true,
      },
    });
    const header = ["id", "userId", "type", "title", "amount", "approved", "createdAt"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [r.id, r.userId, r.type, r.title, r.amount, r.approved, r.createdAt.toISOString()]
          .map(csvEscape)
          .join(",")
      ),
    ];
    return new NextResponse(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="wins.csv"',
      },
    });
  }

  if (type === "yearbook") {
    const rows = await prisma.yearbookPage.findMany({
      where: {
        ...(from && to ? { updatedAt: { gte: from, lte: to } } : {}),
      },
      select: {
        id: true,
        userId: true,
        slug: true,
        status: true,
        displayName: true,
        headline: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ type: "yearbook", count: rows.length, data: rows });
  }

  /** audit */
  const logs = await prisma.auditLog.findMany({
    where: {
      ...(from && to ? { createdAt: { gte: from, lte: to } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 5000,
    select: {
      id: true,
      userId: true,
      action: true,
      resource: true,
      details: true,
      createdAt: true,
    },
  });
  const header = ["id", "userId", "action", "resource", "details", "createdAt"];
  const lines = [
    header.join(","),
    ...logs.map((r) =>
      [r.id, r.userId, r.action, r.resource, r.details, r.createdAt.toISOString()]
        .map(csvEscape)
        .join(",")
    ),
  ];
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="audit.csv"',
    },
  });
}
