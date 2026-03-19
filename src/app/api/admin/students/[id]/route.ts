import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import { studentAdminPatchSchema } from "@/lib/validations/admin";

/**
 * GET /api/admin/students/[id]
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await params;

  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    include: {
      gradChecklist: { include: { assessments: true } },
      serviceLearning: true,
      localObligations: true,
      ccrStatus: true,
      wins: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 20 },
      yearbookPage: true,
      leaderboardPreferences: true,
      auditLogs: { orderBy: { createdAt: "desc" }, take: 25 },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

/**
 * PATCH /api/admin/students/[id] — requires verifiedAgainstOfficialRecords.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const { id } = await params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = studentAdminPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    include: {
      gradChecklist: true,
      serviceLearning: true,
    },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const before = {
    firstName: existing.firstName,
    lastName: existing.lastName,
    displayGpa: existing.displayGpa,
    apIbCourseCount: existing.apIbCourseCount,
    honorDesignation: existing.honorDesignation,
    role: existing.role,
    englishCredits: existing.gradChecklist?.englishCredits,
    mathCredits: existing.gradChecklist?.mathCredits,
    serviceHours: existing.serviceLearning?.hours,
    serviceVerified: existing.serviceLearning?.verified,
  };

  const nameFirst = body.firstName ?? existing.firstName;
  const nameLast = body.lastName ?? existing.lastName;

  await prisma.user.update({
    where: { id },
    data: {
      ...(body.firstName != null ? { firstName: body.firstName } : {}),
      ...(body.lastName != null ? { lastName: body.lastName } : {}),
      ...(body.displayGpa !== undefined ? { displayGpa: body.displayGpa } : {}),
      ...(body.apIbCourseCount != null ? { apIbCourseCount: body.apIbCourseCount } : {}),
      ...(body.honorDesignation != null ? { honorDesignation: body.honorDesignation } : {}),
      ...(body.role != null ? { role: body.role } : {}),
      ...(body.leadershipRolesJson !== undefined
        ? { leadershipRolesJson: body.leadershipRolesJson }
        : {}),
      ...((body.firstName != null || body.lastName != null) && (nameFirst || nameLast)
        ? { name: `${nameFirst ?? ""} ${nameLast ?? ""}`.trim() }
        : {}),
    },
  });

  if ((body.englishCredits != null || body.mathCredits != null) && existing.gradChecklist) {
    await prisma.gradChecklist.update({
      where: { userId: id },
      data: {
        ...(body.englishCredits != null ? { englishCredits: body.englishCredits } : {}),
        ...(body.mathCredits != null ? { mathCredits: body.mathCredits } : {}),
      },
    });
  }

  if (body.serviceHours != null || body.serviceVerified != null) {
    await prisma.serviceLearning.upsert({
      where: { userId: id },
      create: {
        userId: id,
        hours: body.serviceHours ?? 0,
        verified: body.serviceVerified ?? false,
      },
      update: {
        ...(body.serviceHours != null ? { hours: body.serviceHours } : {}),
        ...(body.serviceVerified != null ? { verified: body.serviceVerified } : {}),
      },
    });
  }

  const afterUser = await prisma.user.findUnique({
    where: { id },
    include: { gradChecklist: true, serviceLearning: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: staff.userId,
      action: "admin_student_patch",
      resource: id,
      details: JSON.stringify({
        before,
        after: {
          firstName: afterUser?.firstName,
          lastName: afterUser?.lastName,
          displayGpa: afterUser?.displayGpa,
          apIbCourseCount: afterUser?.apIbCourseCount,
          honorDesignation: afterUser?.honorDesignation,
          role: afterUser?.role,
          englishCredits: afterUser?.gradChecklist?.englishCredits,
          mathCredits: afterUser?.gradChecklist?.mathCredits,
          serviceHours: afterUser?.serviceLearning?.hours,
          serviceVerified: afterUser?.serviceLearning?.verified,
        },
        staffNotes: body.staffNotes ?? null,
        verifiedAgainstOfficialRecords: body.verifiedAgainstOfficialRecords,
      }),
    },
  });

  return NextResponse.json({ ok: true });
}
