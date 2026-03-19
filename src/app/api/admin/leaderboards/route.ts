import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import { DistrictLeaderboardCategory, HonorDesignation } from "@prisma/client";
import { z } from "zod";

const postBodySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("honor"),
    userId: z.string().uuid(),
    designation: z.nativeEnum(HonorDesignation),
  }),
  z.object({
    kind: z.literal("verify_pref"),
    userId: z.string().uuid(),
    category: z.enum(["gpa", "service", "academic_challenge", "leadership"]),
    verified: z.boolean(),
  }),
  z.object({
    kind: z.literal("bulk_verify_service"),
    userIds: z.array(z.string().uuid()).max(200),
  }),
]);

const CAT_MAP: Record<string, DistrictLeaderboardCategory> = {
  gpa: DistrictLeaderboardCategory.GPA,
  service: DistrictLeaderboardCategory.SERVICE,
  academic_challenge: DistrictLeaderboardCategory.ACADEMIC_CHALLENGE,
  leadership: DistrictLeaderboardCategory.LEADERSHIP,
};

/**
 * POST /api/admin/leaderboards — assign honor, verify leaderboard preference, or bulk-verify service hours.
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

  const parsed = postBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;

  if (body.kind === "honor") {
    await prisma.user.update({
      where: { id: body.userId },
      data: { honorDesignation: body.designation },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.userId,
        action: "admin_honor_assign",
        resource: body.userId,
        details: JSON.stringify({ designation: body.designation }),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.kind === "verify_pref") {
    const cat = CAT_MAP[body.category];
    if (!cat) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    await prisma.userLeaderboardPreference.upsert({
      where: { userId_category: { userId: body.userId, category: cat } },
      create: {
        userId: body.userId,
        category: cat,
        optedIn: true,
        verified: body.verified,
      },
      update: { verified: body.verified },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.userId,
        action: "admin_leaderboard_verify",
        resource: body.userId,
        details: JSON.stringify({ category: body.category, verified: body.verified }),
      },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.serviceLearning.updateMany({
    where: { userId: { in: body.userIds } },
    data: { verified: true },
  });
  await prisma.auditLog.create({
    data: {
      userId: staff.userId,
      action: "admin_bulk_verify_service",
      resource: "serviceLearning",
      details: JSON.stringify({ count: body.userIds.length }),
    },
  });
  return NextResponse.json({ ok: true, updated: body.userIds.length });
}

/**
 * GET /api/admin/leaderboards — students with honor + prefs for admin UI.
 */
export async function GET() {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const users = await prisma.user.findMany({
    where: { role: "STUDENT", deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      displayGpa: true,
      honorDesignation: true,
      serviceLearning: { select: { hours: true, verified: true } },
      leaderboardPreferences: true,
    },
    orderBy: [{ lastName: "asc" }],
    take: 500,
  });

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      honorDesignation:
        u.honorDesignation === HonorDesignation.NONE ? null : u.honorDesignation.toLowerCase(),
    })),
  });
}
